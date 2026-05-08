import { SourceData } from '../components/ResultsTable';

export interface MaterialCategory {
  name: string;
  materials: {
    name: string;
    alternateNames?: string[];
    data: SourceData[];
  }[];
}

export const PREDEFINED_MATERIALS: MaterialCategory[] = [
  {
    name: 'Alüminyum Alaşımları',
    materials: [
      {
        name: 'AlSi10Mg',
        alternateNames: ['EN AC-43000', '3.2381'],
        data: [
          {
            id: 'alsi10mg-slm',
            materialName: 'AlSi10Mg',
            productionMethod: 'Katmanlı Üretim (SLM/DMLS)',
            heatTreatment: 'Gerilim Giderme',
            yieldStrength: { value: '230-270 MPa', standard: 'ASTM F3318' },
            uts: { value: '340-400 MPa', standard: 'ASTM F3318' },
            eModule: { value: '70-75 GPa', standard: '' },
            poisson: { value: '0.33', standard: '' },
            density: { value: '2.68 g/cm³', standard: '' },
            shearModule: { value: '26 GPa', standard: '' },
            thermalExp: { value: '23 µm/m-K', standard: '' },
            sourceName: 'EOS - AlSi10Mg Material Data Sheet',
            sourceUrl: 'https://www.eos.info/en/materials/metal/aluminum/alsi10mg'
          },
          {
            id: 'alsi10mg-cast',
            materialName: 'AlSi10Mg',
            productionMethod: 'Kuma Döküm',
            heatTreatment: 'F (As Cast)',
            yieldStrength: { value: '80-110 MPa', standard: 'EN 1706' },
            uts: { value: '160-200 MPa', standard: 'EN 1706' },
            eModule: { value: '71 GPa', standard: '' },
            poisson: { value: '0.33', standard: '' },
            density: { value: '2.65 g/cm³', standard: '' },
            shearModule: { value: '26 GPa', standard: '' },
            thermalExp: { value: '21 µm/m-K', standard: '' },
            sourceName: 'MatWeb - AlSi10Mg Sand Cast',
            sourceUrl: 'https://www.matweb.com'
          }
        ]
      },
      {
        name: 'A356',
        alternateNames: ['EN AC-42100', 'EN AC-AlSi7Mg0,3', '3.2371'],
        data: [
          {
            id: 'a356-t6',
            materialName: 'A356 / EN AC-42100',
            productionMethod: 'Kalıba Döküm (Permanent Mold)',
            heatTreatment: 'T6',
            yieldStrength: { value: '185-220 MPa', standard: 'ASTM B108' },
            uts: { value: '260-300 MPa', standard: 'ASTM B108' },
            eModule: { value: '72.4 GPa', standard: '' },
            poisson: { value: '0.33', standard: '' },
            density: { value: '2.68 g/cm³', standard: '' },
            shearModule: { value: '27 GPa', standard: '' },
            thermalExp: { value: '21.5 µm/m-K', standard: '' },
            sourceName: 'ASM International - A356.0 Properties',
            sourceUrl: 'https://www.asminternational.org'
          }
        ]
      },
      {
        name: '6082-T651',
        alternateNames: ['EN AW-6082', 'AlSi1MgMn', '3.2315'],
        data: [
          {
            id: '6082-t651',
            materialName: '6082-T651',
            productionMethod: 'Haddelenmiş Plaka',
            heatTreatment: 'T651',
            yieldStrength: { value: '250-260 MPa', standard: 'EN 485-2' },
            uts: { value: '300-310 MPa', standard: 'EN 485-2' },
            eModule: { value: '70 GPa', standard: '' },
            poisson: { value: '0.33', standard: '' },
            density: { value: '2.70 g/cm³', standard: '' },
            shearModule: { value: '26 GPa', standard: '' },
            thermalExp: { value: '24 µm/m-K', standard: '' },
            sourceName: 'Thyssenkrupp - Aluminum 6082-T651 Datasheet',
            sourceUrl: 'https://www.thyssenkrupp-materials.co.uk'
          }
        ]
      },
      {
        name: '7075-T651',
        alternateNames: ['EN AW-7075', 'AlZn5,5MgCu', '3.4365'],
        data: [
          {
            id: '7075-t651',
            materialName: '7075-T651',
            productionMethod: 'Haddelenmiş Plaka',
            heatTreatment: 'T651',
            yieldStrength: { value: '440-500 MPa', standard: 'EN 485-2' },
            uts: { value: '540-570 MPa', standard: 'EN 485-2' },
            eModule: { value: '71.7 GPa', standard: '' },
            poisson: { value: '0.33', standard: '' },
            density: { value: '2.81 g/cm³', standard: '' },
            shearModule: { value: '26.9 GPa', standard: '' },
            thermalExp: { value: '23.4 µm/m-K', standard: '' },
            sourceName: 'MatWeb - Aluminum 7075-T651',
            sourceUrl: 'https://www.matweb.com/search/DataSheet.aspx?MatGUID=4f19a4860bc143c9bc6079963e62f026'
          }
        ]
      }
    ]
  },
  {
    name: 'Paslanmaz Çelikler',
    materials: [
      {
        name: '316L',
        alternateNames: ['1.4404', 'UNS S31603', 'CF3M (Döküm)'],
        data: [
          {
            id: '316l-wrought',
            materialName: '316L (Dövme/Haddelenmiş)',
            productionMethod: 'Dövme / Haddeleme',
            heatTreatment: 'Tavlanmış',
            yieldStrength: { value: '200-240 MPa', standard: 'ASTM A240' },
            uts: { value: '500-600 MPa', standard: 'ASTM A240' },
            eModule: { value: '193 GPa', standard: '' },
            poisson: { value: '0.30', standard: '' },
            density: { value: '8.0 g/cm³', standard: '' },
            shearModule: { value: '77 GPa', standard: '' },
            thermalExp: { value: '16 µm/m-K', standard: '' },
            sourceName: 'AZoM - Stainless Steel 316L Properties',
            sourceUrl: 'https://www.azom.com/article.aspx?ArticleID=2382'
          },
          {
            id: 'cf3m-cast',
            materialName: 'CF3M (Cast 316L)',
            productionMethod: 'Hassas Döküm (Investment Casting)',
            heatTreatment: 'Çözeltiye Alma',
            yieldStrength: { value: '205 MPa', standard: 'ASTM A351' },
            uts: { value: '485 MPa', standard: 'ASTM A351' },
            eModule: { value: '190 GPa', standard: '' },
            poisson: { value: '0.30', standard: '' },
            density: { value: '7.75 g/cm³', standard: '' },
            shearModule: { value: '75 GPa', standard: '' },
            thermalExp: { value: '15.5 µm/m-K', standard: '' },
            sourceName: 'CastingQuality - CF3M Stainless Steel',
            sourceUrl: 'https://www.castingquality.com/stainless-steel-casting/cf3m.html'
          }
        ]
      },
      {
        name: 'PH 17-4',
        alternateNames: ['1.4542', 'UNS S17400', 'AISI 630'],
        data: [
          {
            id: 'ph17-4-h900',
            materialName: 'PH 17-4',
            productionMethod: 'Dövme',
            heatTreatment: 'H900 (Yaşlandırılmış)',
            yieldStrength: { value: '1170-1200 MPa', standard: 'ASTM A564' },
            uts: { value: '1310-1400 MPa', standard: 'ASTM A564' },
            eModule: { value: '197 GPa', standard: '' },
            poisson: { value: '0.27', standard: '' },
            density: { value: '7.8 g/cm³', standard: '' },
            shearModule: { value: '77 GPa', standard: '' },
            thermalExp: { value: '10.8 µm/m-K', standard: '' },
            sourceName: 'AK Steel - 17-4 PH Stainless Steel Datasheet',
            sourceUrl: 'https://www.aksteel.com'
          }
        ]
      }
    ]
  },
  {
    name: 'Bakır Alaşımları',
    materials: [
      {
        name: 'Cu3 (Nickel Aluminum Bronze)',
        alternateNames: ['CuAl10Ni5Fe4', 'CW307G', '2.0966', 'UNS C63000'],
        data: [
          {
            id: 'cu3-cast',
            materialName: 'Cu3 / CuAl10Ni5Fe4',
            productionMethod: 'Kum Döküm (Marine)',
            heatTreatment: 'Isıl İşlem Yok',
            yieldStrength: { value: '270-300 MPa', standard: 'EN 1982' },
            uts: { value: '600-700 MPa', standard: 'EN 1982' },
            eModule: { value: '120 GPa', standard: '' },
            poisson: { value: '0.34', standard: '' },
            density: { value: '7.6 g/cm³', standard: '' },
            shearModule: { value: '44 GPa', standard: '' },
            thermalExp: { value: '16.2 µm/m-K', standard: '' },
            sourceName: 'Lebronze Alloys - CuAl10Ni5Fe4 Technical Data',
            sourceUrl: 'https://www.lebronze-alloys.com/en/alloys/19-copper-aluminum-nickel-iron-alloys-c63000'
          }
        ]
      }
    ]
  },
  {
    name: 'Polimerler',
    materials: [
      {
        name: 'Delrin',
        alternateNames: ['POM', 'Asetal Homopolimer'],
        data: [
          {
            id: 'delrin-pom',
            materialName: 'Delrin (POM)',
            productionMethod: 'Enjeksiyon / Ekstrüzyon',
            heatTreatment: 'Isıl İşlem Yok',
            yieldStrength: { value: '70 MPa', standard: 'ISO 527' },
            uts: { value: '70-80 MPa', standard: 'ISO 527' },
            eModule: { value: '3.0 GPa', standard: '' },
            poisson: { value: '0.35', standard: '' },
            density: { value: '1.42 g/cm³', standard: '' },
            shearModule: { value: '1.1 GPa', standard: '' },
            thermalExp: { value: '110 µm/m-K', standard: '' },
            sourceName: 'DuPont - Delrin Acetal Resin Product Guide',
            sourceUrl: 'https://www.dupont.com/products/delrin.html'
          }
        ]
      },
      {
        name: 'HDPE',
        alternateNames: ['Yüksek Yoğunluklu Polietilen', 'PE-HD'],
        data: [
          {
            id: 'hdpe-100',
            materialName: 'HDPE',
            productionMethod: 'Ekstrüzyon',
            heatTreatment: 'Isıl İşlem Yok',
            yieldStrength: { value: '25-30 MPa', standard: 'ISO 527' },
            uts: { value: '30-35 MPa', standard: 'ISO 527' },
            eModule: { value: '1.0-1.2 GPa', standard: '' },
            poisson: { value: '0.40', standard: '' },
            density: { value: '0.95 g/cm³', standard: '' },
            shearModule: { value: '0.4 GPa', standard: '' },
            thermalExp: { value: '200 µm/m-K', standard: '' },
            sourceName: 'ScienceDirect - Polyethylene (HDPE) Article',
            sourceUrl: 'https://www.sciencedirect.com/topics/engineering/high-density-polyethylene'
          }
        ]
      }
    ]
  }
];
