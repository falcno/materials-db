import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// Create a system prompt that strictly enforces the JSON schema and 10 sources rule.
const SYSTEM_PROMPT = `
You are an expert Materials Science AI operating the MILPOD Marine Material Database. 
Your job is to provide exact mechanical and thermal properties for a requested material (Metals or Polymers).

CRITICAL RULES:
1. You MUST provide exactly 10 distinct rows/objects in the JSON array. Each object represents a DIFFERENT source of information (e.g., MatWeb, ASM Material Data Sheet, AZoM, MakeItFrom, specific textbook excerpts, supplier data sheets like Xometry or Protolabs, or specific ISO/ASTM standards).
2. For each source, extract the 7 requested properties. If a property is not typically listed in that specific source, return "" (empty string).
3. Properties MUST include the measurement standard if known (e.g., "450 MPa (ASTM E8)").
4. Output MUST be valid JSON, strictly adhering to the schema requested. No markdown, no conversational text.

Schema:
{
  "data": [
    {
      "id": "uuid",
      "materialName": "Name of Material",
      "yieldStrength": { "value": "value with units", "standard": "standard or empty" },
      "uts": { "value": "value with units", "standard": "standard or empty" },
      "eModule": { "value": "value with units", "standard": "standard or empty" },
      "poisson": { "value": "value", "standard": "" },
      "density": { "value": "value with units", "standard": "" },
      "shearModule": { "value": "value with units", "standard": "" },
      "thermalExp": { "value": "value with units", "standard": "" },
      "sourceName": "Name of the Source (e.g., MatWeb)",
      "sourceUrl": "URL if applicable, otherwise empty"
    }
  ]
}
`;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // If no API key is provided, we return mock data for demonstration purposes
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
      console.warn('No OpenAI API Key found. Returning mock data.');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      return NextResponse.json({ data: generateMockData(query) });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Retrieve properties for: ${query}. Remember, exactly 10 different sources.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const resultText = completion.choices[0].message.content;
    if (!resultText) throw new Error("Empty response from AI");

    const resultJson = JSON.parse(resultText);

    return NextResponse.json({ data: resultJson.data });

  } catch (error: any) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

function generateMockData(query: string) {
  const sources = [
    { name: 'MatWeb', url: 'https://www.matweb.com' },
    { name: 'ASM Aerospace Specification Metals', url: 'https://aerospacemetals.com' },
    { name: 'AZoM - Materials', url: 'https://www.azom.com' },
    { name: 'MakeItFrom', url: 'https://www.makeitfrom.com' },
    { name: 'Supplier Data Sheet (Protolabs)', url: 'https://www.protolabs.com' },
    { name: 'Handbook of Materials (Smith)', url: '' },
    { name: 'ISO 6892-1 Technical Report', url: '' },
    { name: 'Engineering Toolbox', url: 'https://www.engineeringtoolbox.com' },
    { name: 'Supplier Data Sheet (Xometry)', url: 'https://www.xometry.com' },
    { name: 'NIST Property Database', url: 'https://www.nist.gov' },
  ];

  return sources.map((source, index) => ({
    id: `mock-${index}`,
    materialName: query.toUpperCase(),
    yieldStrength: { value: '250 MPa', standard: 'ASTM E8' },
    uts: { value: '500 MPa', standard: 'ASTM E8' },
    eModule: { value: '200 GPa', standard: 'ISO 527' },
    poisson: { value: '0.3', standard: '' },
    density: { value: '7.8 g/cm³', standard: '' },
    shearModule: { value: '80 GPa', standard: '' },
    thermalExp: { value: index % 2 === 0 ? '11 µm/m-K' : '', standard: '' },
    sourceName: source.name,
    sourceUrl: source.url,
  }));
}
