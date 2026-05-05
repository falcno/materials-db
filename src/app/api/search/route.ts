import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Groq via OpenAI SDK - Stable Free Tier
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `
You are an expert Materials Science AI operating the MILPOD Denizcilik Malzeme Veritabanı. 
Your job is to provide exact mechanical and thermal properties for a requested material (Metals or Polymers).

CRITICAL RULES:
1. You MUST provide exactly 10 distinct rows/objects in the JSON array. Each object represents a DIFFERENT source of information.
2. SOURCE NAMES: Be very descriptive. Don't just say "MatWeb". Say "MatWeb - [Material Name] Teknik Veri Sayfası" or "ASM Material Data Sheet - [Material Name]" or "Scientific Article: [Title] (DOI: [Number])".
3. SOURCE LINKS: You MUST provide a DEEP LINK (direct URL) to the specific material datasheet, article, or book page if at all possible. If you don't know the exact deep link, provide a highly relevant search result link from that source or a direct link to the DOI (e.g., https://doi.org/[DOI]).
4. For each source, extract the 7 requested properties. If a property is not typically listed in that specific source, return "" (empty string).
5. Properties MUST include the measurement standard if known (e.g., "450 MPa (ASTM E8)").
6. ALL OUTPUT TEXT MUST BE IN TURKISH. Use Turkish decimal formats if necessary and SI units (MPa, GPa, g/cm³ vs). 
7. Output MUST be valid JSON, strictly adhering to the schema requested. No markdown, no conversational text.

Schema:
{
  "data": [
    {
      "id": "uuid",
      "materialName": "Malzeme Adı",
      "yieldStrength": { "value": "değer ve birim", "standard": "standart veya boş" },
      "uts": { "value": "değer ve birim", "standard": "standart veya boş" },
      "eModule": { "value": "değer ve birim", "standard": "standart veya boş" },
      "poisson": { "value": "değer", "standard": "" },
      "density": { "value": "değer ve birim", "standard": "" },
      "shearModule": { "value": "değer ve birim", "standard": "" },
      "thermalExp": { "value": "değer ve birim", "standard": "" },
      "sourceName": "Kaynağın Tam Adı (örn: MatWeb - AISI 316L Paslanmaz Çelik Veri Sayfası)",
      "sourceUrl": "Doğrudan kaynağa giden link (Deep Link)"
    }
  ]
}
`;

export async function POST(req: Request) {
  let userQuery = 'Bilinmeyen Malzeme';
  
  try {
    const json = await req.json();
    if (json.query) {
      userQuery = json.query;
    }

    if (!userQuery) {
      return NextResponse.json({ error: 'Arama sorgusu gerekli' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy_key') {
      console.warn('GROQ_API_KEY bulunamadı. Örnek veri döndürülüyor.');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({ 
        warning: 'Sistemde GROQ_API_KEY bulunamadığı için gerçek yapay zeka araması yapılamıyor. Aşağıdaki veriler temsilidir.',
        data: generateMockData(userQuery) 
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Şu malzeme için özellikleri getir: ${userQuery}. Unutma, tam 10 farklı kaynak olmak zorunda.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const resultText = completion.choices[0].message.content;
    if (!resultText) throw new Error("Yapay zekadan boş yanıt geldi");

    const resultJson = JSON.parse(resultText);
    return NextResponse.json({ data: resultJson.data });

  } catch (error: any) {
    console.error('API Hatası:', error);
    console.warn('Hatadan dolayı örnek veriye (fallback) geçiliyor.');
    return NextResponse.json({ 
      warning: `Yapay zeka servisi hata verdi (Groq: ${error.message}). Temsili veriler gösteriliyor.`,
      data: generateMockData(userQuery) 
    });
  }
}

function generateMockData(query: string) {
  const sources = [
    { name: 'MatWeb', url: 'https://www.matweb.com' },
    { name: 'ASM Malzeme Veri Sayfası', url: 'https://aerospacemetals.com' },
    { name: 'AZoM - Materials', url: 'https://www.azom.com' },
    { name: 'MakeItFrom', url: 'https://www.makeitfrom.com' },
    { name: 'Tedarikçi Veri Föyü (Protolabs)', url: 'https://www.protolabs.com' },
    { name: 'Malzeme El Kitabı (Smith)', url: '' },
    { name: 'ISO 6892-1 Teknik Raporu', url: '' },
    { name: 'Mühendislik Araç Kutusu', url: 'https://www.engineeringtoolbox.com' },
    { name: 'Tedarikçi Veri Föyü (Xometry)', url: 'https://www.xometry.com' },
    { name: 'NIST Özellikler Veritabanı', url: 'https://www.nist.gov' },
  ];

  const qLen = query.length || 5;

  return sources.map((source, index) => ({
    id: `mock-${index}`,
    materialName: query.toUpperCase(),
    yieldStrength: { value: `${200 + (qLen * 10) + (index * 5)} MPa`, standard: 'ASTM E8' },
    uts: { value: `${400 + (qLen * 15) + (index * 10)} MPa`, standard: 'ASTM E8' },
    eModule: { value: `${100 + qLen} GPa`, standard: 'ISO 527' },
    poisson: { value: `0.${25 + (qLen % 10)}`, standard: '' },
    density: { value: `${(2 + (qLen % 6)).toFixed(1)} g/cm³`, standard: '' },
    shearModule: { value: `${40 + qLen} GPa`, standard: '' },
    thermalExp: { value: index % 2 === 0 ? `${10 + (qLen % 5)} µm/m-K` : '', standard: '' },
    sourceName: source.name,
    sourceUrl: source.url,
  }));
}
