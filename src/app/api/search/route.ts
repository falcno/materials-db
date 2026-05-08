import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Groq via OpenAI SDK - Stable Free Tier
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `
You are an expert Materials Science AI operating the MILPOD Denizcilik Malzeme Veritabanı. 
Your job is to provide EXACT and VERIFIED mechanical and thermal properties for a requested material (Metals or Polymers), categorized by their PRODUCTION METHOD and HEAT TREATMENT.

CRITICAL RULES FOR SOURCE DIVERSITY & ACCURACY:
1. SOURCE VARIETY: You MUST use a diverse set of sources. DO NOT rely only on MatWeb. Your sources MUST include:
   - Scientific Journals (e.g., Journal of Materials Science, Elsevier, Springer).
   - Technical Textbooks (e.g., Callister's Materials Science, ASM Handbooks).
   - Industry Standards (e.g., ASTM, ISO, DIN, EN).
   - Research Papers (e.g., ScienceDirect, ResearchGate).
   - Manufacturer Datasheets (e.g., Sandvik, Outokumpu, DuPont).
2. DATA ACCURACY: Verification is mandatory. Ensure the values provided are accurate for the specific production method and heat treatment. If values differ between sources, provide the most widely accepted scientific value.
3. QUANTITY: You MUST provide exactly 10 distinct rows/objects in the JSON array, each from a UNIQUE type of source if possible.
4. PRODUCTION METHODS & HEAT TREATMENTS: Use ONLY Turkish terms. (e.g., Kuma Döküm, Hassas Döküm, Dövme, Haddeleme, Enjeksiyon Kalıplama, 3D Yazıcı, Tavlanmış, T6, Isıl İşlem Yok).
5. SOURCE LINKS: Provide DEEP LINKS (direct URLs) to the specific article, paper, or datasheet. DO NOT provide homepage URLs.
6. ALL OUTPUT TEXT MUST BE IN TURKISH. Use Turkish decimal formats (comma as decimal separator) and SI units.
7. Output MUST be valid JSON.

Schema:
{
  "data": [
    {
      "id": "uuid",
      "materialName": "Malzeme Adı",
      "alternateNames": ["Alternatif Ad 1", "Alternatif Ad 2"],
      "productionMethod": "Üretim Yöntemi",
      "heatTreatment": "Isıl İşlem",
      "yieldStrength": { "value": "değer ve birim", "standard": "standart veya boş" },
      "uts": { "value": "değer ve birim", "standard": "standart veya boş" },
      "eModule": { "value": "değer ve birim", "standard": "standart veya boş" },
      "poisson": { "value": "değer", "standard": "" },
      "density": { "value": "değer ve birim", "standard": "" },
      "shearModule": { "value": "değer ve birim", "standard": "" },
      "thermalExp": { "value": "değer ve birim", "standard": "" },
      "sourceName": "Kaynağın Tam Adı (Örn: ASM Handbook Vol 1 - Properties and Selection)",
      "sourceUrl": "Doğrudan Makale/Veri Linki"
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
      await new Promise((resolve) => setTimeout(resolve, 500)); 
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

    try {
      const resultJson = JSON.parse(resultText);
      if (resultJson && resultJson.data) {
        return NextResponse.json({ data: resultJson.data });
      } else if (Array.isArray(resultJson)) {
        return NextResponse.json({ data: resultJson });
      } else {
        throw new Error("JSON formatı geçersiz (data anahtarı bulunamadı)");
      }
    } catch (parseError) {
      console.error('Parse Hatası:', parseError, 'Gelen Metin:', resultText);
      throw new Error("Yapay zeka yanıtı okunabilir bir tabloya dönüştürülemedi.");
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
