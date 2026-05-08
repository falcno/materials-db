import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Groq via OpenAI SDK - Stable Free Tier
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `
You are an expert Materials Science AI operating the MILPOD Denizcilik Malzeme Veritabanı. 
Your job is to provide EXACT and VERIFIED mechanical and thermal properties for a requested material, categorized by their PRODUCTION METHOD and HEAT TREATMENT.

SOURCE PRIORITY:
1. Peer-reviewed Research Papers with DOI.
2. Technical Textbooks and Handbooks (e.g., ASM Handbooks, Callister, Smith).
3. Industry Standards (ASTM, ISO, DIN).
4. Verified Manufacturer Technical Datasheets.

CRITICAL RULES:
1. DATA RANGES: If a source provides a range (e.g., 240-260 MPa), you MUST report the range as "240-260 MPa". DO NOT average it.
2. CITATIONS: 
   - For Research Papers: Provide the full title and DOI in the sourceName/sourceUrl fields.
   - For Books: Provide "Title, Author, Edition (Page/Section if known)".
3. ACCURACY: Ensure values match the production method (e.g., Cast vs Wrought) and heat treatment (e.g., T6, Annealed).
4. QUANTITY: Provide exactly 10 distinct sources.
5. LANGUAGE: All output text (except titles/DOIs) MUST be in Turkish. Use comma as decimal separator.
6. TURKISH TERMS: Use "Kuma Döküm", "Dövme", "Haddeleme", "Tavlanmış", "Isıl İşlem Yok" etc.

Schema:
{
  "data": [
    {
      "id": "uuid",
      "materialName": "Malzeme Adı",
      "alternateNames": ["Alternatif Ad 1", "Alternatif Ad 2"],
      "productionMethod": "Üretim Yöntemi",
      "heatTreatment": "Isıl İşlem",
      "yieldStrength": { "value": "değer/aralık ve birim", "standard": "standart" },
      "uts": { "value": "değer/aralık ve birim", "standard": "standart" },
      "eModule": { "value": "değer/aralık ve birim", "standard": "standart" },
      "poisson": { "value": "değer", "standard": "" },
      "density": { "value": "değer ve birim", "standard": "" },
      "shearModule": { "value": "değer ve birim", "standard": "" },
      "thermalExp": { "value": "değer ve birim", "standard": "" },
      "sourceName": "Akademik Kaynak Adı / DOI",
      "sourceUrl": "DOI Linki veya PDF Linki"
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
        query: `${query} mechanical properties datasheet DOI research paper textbook ScienceDirect scholar`,
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
      : "No real-time search results available. Use internal knowledge but prioritize deep links.";

    // Step 2: Generate properties using LLM
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `SEARCH RESULTS:\n${context}\n\nMALZEME: ${userQuery}. Yukarıdaki arama sonuçlarını kullanarak tam 10 farklı satır veri getir.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Lower temperature for more consistent extraction
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
