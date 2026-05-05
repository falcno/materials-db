import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Groq via OpenAI SDK - Stable Free Tier
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `
You are an expert Materials Science AI operating the MILPOD Denizcilik Malzeme Veritabanı. 
Your job is to provide exact mechanical and thermal properties for a requested material (Metals or Polymers), categorized by their PRODUCTION METHOD and HEAT TREATMENT.

CRITICAL RULES:
1. You MUST provide exactly 10 distinct rows/objects in the JSON array.
2. PRODUCTION METHODS & HEAT TREATMENTS: This is vital. For each source, identify the specific production method (e.g., Sand Casting, Investment Casting, Forging, Rolling, Injection Molding, 3D Printing) and heat treatment (e.g., Annealed, T6, No Heat Treatment).
3. SOURCE NAMES: Be very descriptive. e.g., "MatWeb - AISI 316L Sand Cast Datasheet".
4. SOURCE LINKS: Provide deep links (direct URLs) to the specific material datasheet.
5. ALL OUTPUT TEXT MUST BE IN TURKISH. Use Turkish decimal formats and SI units. 
6. Output MUST be valid JSON.

Schema:
{
  "data": [
    {
      "id": "uuid",
      "materialName": "Malzeme Adı",
      "productionMethod": "Üretim Yöntemi (örn: Kuma Döküm, Dövme, Enjeksiyon)",
      "heatTreatment": "Isıl İşlem (örn: Tavlanmış, T6, Isıl İşlem Yok)",
      "yieldStrength": { "value": "değer ve birim", "standard": "standart veya boş" },
      "uts": { "value": "değer ve birim", "standard": "standart veya boş" },
      "eModule": { "value": "değer ve birim", "standard": "standart veya boş" },
      "poisson": { "value": "değer", "standard": "" },
      "density": { "value": "değer ve birim", "standard": "" },
      "shearModule": { "value": "değer ve birim", "standard": "" },
      "thermalExp": { "value": "değer ve birim", "standard": "" },
      "sourceName": "Kaynağın Tam Adı",
      "sourceUrl": "Doğrudan Link"
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Reduced delay
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
