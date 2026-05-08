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
2. PRODUCTION METHODS & HEAT TREATMENTS: Use ONLY Turkish terms. (e.g., Kuma Döküm, Hassas Döküm, Dövme, Haddeleme, Enjeksiyon Kalıplama, 3D Yazıcı, Tavlanmış, T6, Isıl İşlem Yok).
3. ALTERNATE NAMES: For the requested material, always list its common equivalents or standard codes (e.g., DIN, EN, UNS, AISI) in the alternateNames field.
4. SOURCE NAMES: Be very descriptive. e.g., "MatWeb - AISI 316L Sand Cast Datasheet".
5. SOURCE LINKS: Provide DEEP LINKS (direct URLs) to the specific material datasheet. DO NOT just provide the homepage URL. If you don't know the exact deep link, try to construct a plausible one for MatWeb or similar databases based on common URL patterns, or prioritize sources where deep linking is known.
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
    { name: 'MatWeb - Material Property Data', url: 'https://www.matweb.com/search/MaterialGroupSearch.aspx' },
    { name: 'ASM Material Property Data', url: 'https://aerospacemetals.com/alloys/' },
    { name: 'AZoM - Materials Information', url: 'https://www.azom.com/materials.aspx' },
    { name: 'MakeItFrom - Material Database', url: 'https://www.makeitfrom.com/material-properties/' },
    { name: 'Xometry Material Guide', url: 'https://www.xometry.com/resources/materials/' },
    { name: 'Protolabs Material Data', url: 'https://www.protolabs.com/resources/materials/' },
    { name: 'NIST Material Measurement Laboratory', url: 'https://www.nist.gov/mml' },
    { name: 'Engineering Toolbox', url: 'https://www.engineeringtoolbox.com/metal-alloys-densities-d_50.html' },
    { name: 'Matmatch Material Search', url: 'https://matmatch.com/search' },
    { name: 'Sandmeyer Steel Company Datasheets', url: 'https://www.sandmeyersteel.com/stainless-steel-nickel-alloy-datasheets.html' },
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
