import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Groq via OpenAI SDK - Stable Free Tier
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `
You are a highly conservative Materials Science AI. Your primary directive is DATA INTEGRITY.
In engineering, an incorrect value can lead to catastrophic failure. You MUST treat every data point as critical.

STRICT VERIFICATION PROTOCOL (JSON OUTPUT):
1. ZERO-KNOWLEDGE PRINCIPLE: Do not use your internal weights for numerical values. Use ONLY the provided SEARCH RESULTS.
2. IDENTITY MATCHING: Ensure the search result specifically refers to the exact grade (e.g., 316L vs 316). If the result is for a different grade, DISCARD IT.
3. CONTEXTUAL ACCURACY: Mechanical properties are NOT static. They MUST match the:
   - Production Method (e.g., Wrought, Sand Cast, LPBF).
   - Heat Treatment (e.g., Annealed, T6, H900).
   If these do not match the search result, do not include the row.
4. RANGE PRESERVATION: If a source gives a range, output the range (e.g., "200-220 MPa"). Never average.
5. UNIT CONVERSION: If the source is in 'ksi', convert to 'MPa' carefully (1 ksi ≈ 6.895 MPa) and specify the standard.
6. QUALITY OVER QUANTITY: Return 1 to 10 rows. If you only find 1 truly verified source, return only 1 row. DO NOT hallucinate to fill the table.
7. CITATIONS: Provide DOI if available. For books, provide Title, Edition, and Page.

LANGUAGE & TERMINOLOGY:
- All output text MUST be in Turkish (except names/DOIs).
- Use "Kuma Döküm", "Hassas Döküm", "Dövme", "Haddeleme", "Tavlanmış", "Çözeltiye Alınmış" etc.
- Decimal separator: comma (,).

Schema (JSON):
{
  "data": [
    {
      "id": "uuid",
      "materialName": "Exact Material Grade",
      "alternateNames": ["Alt Name"],
      "productionMethod": "Turkish Term",
      "heatTreatment": "Turkish Term",
      "yieldStrength": { "value": "Value/Range", "standard": "ASTM/ISO/DOI" },
      "uts": { "value": "Value/Range", "standard": "ASTM/ISO/DOI" },
      "eModule": { "value": "Value/Range", "standard": "" },
      "poisson": { "value": "Value", "standard": "" },
      "density": { "value": "Value", "standard": "" },
      "shearModule": { "value": "Value", "standard": "" },
      "thermalExp": { "value": "Value", "standard": "" },
      "sourceName": "Full Academic Citation / DOI",
      "sourceUrl": "Direct URL / DOI Link"
    }
  ]
}
`;

async function searchWeb(query: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} technical datasheet mechanical properties thermal properties "yield strength" "ultimate tensile strength" DOI scholar textbook`,
        search_depth: "advanced",
        max_results: 15,
        include_images: false
      })
    });

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Tavily Hatası:', error);
    return null;
  }
}


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
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      return NextResponse.json({ 
        warning: 'Sistemde GROQ_API_KEY bulunamadığı için gerçek yapay zeka araması yapılamıyor. Aşağıdaki veriler temsilidir.',
        data: generateMockData(userQuery) 
      });
    }

    // Step 1: Search the web for real data
    const searchResults = await searchWeb(userQuery);
    const context = searchResults 
      ? JSON.stringify(searchResults.map((r: any) => ({ title: r.title, url: r.url, content: r.content })))
      : "No real-time search results available. STOP and return empty or warning.";

    // Step 2: Generate properties using LLM with ZERO HALLUCINATION policy
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `
SEARCH RESULTS:
${context}

MALZEME: ${userQuery}

TALİMAT: 
1. Sadece yukarıdaki SEARCH RESULTS içinde geçen verileri kullan. 
2. Eğer veri sonuçlarda yoksa ASLA uydurma.
3. Malzeme adı uyuşmuyorsa o kaynağı kullanma.
4. En fazla 10, en az 1 satır getir (ne kadar güvenilir veri varsa o kadar).
5. JSON formatında yanıt ver.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0, // Deterministic output
    });

    const resultText = completion.choices[0].message.content;
    if (!resultText) throw new Error("Yapay zekadan boş yanıt geldi");

    try {
      const resultJson = JSON.parse(resultText);
      return new NextResponse(JSON.stringify({ data: resultJson.data || resultJson }), {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } catch (parseError) {
      throw new Error("Yapay zeka yanıtı okunamadı.");
    }

  } catch (error: any) {
    console.error('API Hatası:', error);
    return NextResponse.json({ 
      warning: `Yapay zeka servisi hata verdi (Groq: ${error.message}). Temsili veriler gösteriliyor.`,
      data: generateMockData(userQuery) 
    });
  }
}

function generateMockData(query: string) {
  const sources = [
    { name: 'ASM Handbook Vol 1: Properties and Selection: Irons, Steels, and High-Performance Alloys', url: 'https://www.asminternational.org/materials-resources/handbooks' },
    { name: 'Journal of Materials Research and Technology - Stainless Steel Study', url: 'https://www.sciencedirect.com/journal/journal-of-materials-research-and-technology' },
    { name: 'ASTM A240/A240M Standard Specification for Chromium and Chromium-Nickel Stainless Steel', url: 'https://www.astm.org/a0240_a0240m-22.html' },
    { name: 'Springer: Materials Science and Engineering Handbook', url: 'https://link.springer.com/book/10.1007/978-3-030-11155-7' },
    { name: 'Outokumpu Stainless Steel Handbook', url: 'https://www.outokumpu.com/en/expertise/2021/stainless-steel-handbook' },
    { name: 'ScienceDirect: Mechanical Properties of Marine Grade Steels', url: 'https://www.sciencedirect.com/topics/engineering/marine-grade-steel' },
    { name: 'ResearchGate: Comparative Analysis of 316L Production Methods', url: 'https://www.researchgate.net/search/publications?q=316L+mechanical+properties' },
    { name: 'MatWeb - Material Property Data (Validated Sheet)', url: 'https://www.matweb.com/search/DataSheet.aspx?MatGUID=9ae3515477264a8e9ad75a3173e9140c' },
    { name: 'ISO 15510:2014 Stainless steels — Chemical composition', url: 'https://www.iso.org/standard/55474.html' },
    { name: 'DuPont Materials Engineering Guide', url: 'https://www.dupont.com/products/delrin.html' },
  ];

  const qLen = query.length || 5;

  return sources.map((source, index) => ({
    id: `mock-${index}`,
    materialName: query.toUpperCase(),
    alternateNames: [query.toUpperCase() + '-ALT'],
    productionMethod: index < 5 ? 'Kuma Döküm' : 'Hassas Döküm',
    heatTreatment: index % 2 === 0 ? 'Tavlanmış' : 'Isıl İşlem Yok',
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
