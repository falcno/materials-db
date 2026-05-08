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
        alternateNames: ['EN AC-43000', '3.2381', 'A360'],
        data: [
          { 
            id: 'alsi10mg-springer', 
            materialName: 'AlSi10Mg', 
            productionMethod: 'LPBF (Lazer Toz Yatağı)', 
            heatTreatment: 'Gerilim Giderilmiş', 
            yieldStrength: { value: '230-260 MPa', standard: 'ASTM E8' }, 
            uts: { value: '330-350 MPa', standard: 'ASTM E8' }, 
            eModule: { value: '70-75 GPa', standard: '' }, 
            poisson: { value: '0.33', standard: '' }, 
            density: { value: '2.67 g/cm³', standard: '' }, 
            shearModule: { value: '26 GPa', standard: '' }, 
            thermalExp: { value: '23 µm/m-K', standard: '' }, 
            sourceName: 'Springer: Welding in the World - DOI: 10.1007/s40194-017-0486-y', 
            sourceUrl: 'https://doi.org/10.1007/s40194-017-0486-y' 
          },
          { 
            id: 'alsi10mg-asm', 
            materialName: 'AlSi10Mg', 
            productionMethod: 'Kuma Döküm', 
            heatTreatment: 'T6', 
            yieldStrength: { value: '110-125 MPa', standard: '' }, 
            uts: { value: '190-210 MPa', standard: '' }, 
            eModule: { value: '71 GPa', standard: '' }, 
            poisson: { value: '0.33', standard: '' }, 
            density: { value: '2.65 g/cm³', standard: '' }, 
            shearModule: { value: '26 GPa', standard: '' }, 
            thermalExp: { value: '21 µm/m-K', standard: '' }, 
            sourceName: 'ASM Handbook Vol 2: Properties and Selection: Nonferrous Alloys', 
            sourceUrl: 'https://www.asminternational.org/materials-resources/handbooks' 
          }
        ]
      },
      {
        name: 'A356',
        alternateNames: ['EN AC-42100', 'EN AC-AlSi7Mg0,3', '3.2371', 'A356.0'],
        data: [
          { 
            id: 'a356-asm-t6', 
            materialName: 'A356.0', 
            productionMethod: 'Kokil Döküm', 
            heatTreatment: 'T6', 
            yieldStrength: { value: '180-230 MPa', standard: 'ASTM B108' }, 
            uts: { value: '255-310 MPa', standard: 'ASTM B108' }, 
            eModule: { value: '72.4 GPa', standard: '' }, 
            poisson: { value: '0.33', standard: '' }, 
            density: { value: '2.68 g/cm³', standard: '' }, 
            shearModule: { value: '27.2 GPa', standard: '' }, 
            thermalExp: { value: '21.4 µm/m-K', standard: '' }, 
            sourceName: 'ASM International - A356.0 Technical Profile', 
            sourceUrl: 'https://products.asminternational.org/search/index.do' 
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
        alternateNames: ['CuAl10Ni5Fe4', 'CW307G', '2.0966', 'UNS C63000', 'ASTM B150'],
        data: [
          { 
            id: 'cu3-researchgate', 
            materialName: 'CuAl10Ni5Fe4', 
            productionMethod: 'İşlenmiş (Wrought)', 
            heatTreatment: 'Tavlanmış', 
            yieldStrength: { value: '270-400 MPa', standard: 'ASTM B150' }, 
            uts: { value: '620-800 MPa', standard: 'ASTM B150' }, 
            eModule: { value: '115-120 GPa', standard: '' }, 
            poisson: { value: '0.34', standard: '' }, 
            density: { value: '7.58 g/cm³', standard: '' }, 
            shearModule: { value: '44 GPa', standard: '' }, 
            thermalExp: { value: '16.2 µm/m-K', standard: '' }, 
            sourceName: 'ResearchGate: Mechanical Properties of C63000 - DOI: 10.1016/j.matdes.2015.06.101', 
            sourceUrl: 'https://doi.org/10.1016/j.matdes.2015.06.101' 
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
        alternateNames: ['1.4404', 'UNS S31603', 'CF3M (Döküm)', 'A4 Stainless'],
        data: [
          { 
            id: '316l-sciencedirect', 
            materialName: '316L', 
            productionMethod: 'İşlenmiş (Levha)', 
            heatTreatment: 'Tavlanmış', 
            yieldStrength: { value: '290 MPa', standard: 'ASTM A240' }, 
            uts: { value: '580 MPa', standard: 'ASTM A240' }, 
            eModule: { value: '193 GPa', standard: '' }, 
            poisson: { value: '0.30', standard: '' }, 
            density: { value: '8.0 g/cm³', standard: '' }, 
            shearModule: { value: '77 GPa', standard: '' }, 
            thermalExp: { value: '16 µm/m-K', standard: '' }, 
            sourceName: 'ScienceDirect: 316L Microstructure & Properties - DOI: 10.1016/j.msea.2017.08.054', 
            sourceUrl: 'https://doi.org/10.1016/j.msea.2017.08.054' 
          },
          { 
            id: '316l-asm-handbook', 
            materialName: '316L', 
            productionMethod: 'Dikişsiz Boru', 
            heatTreatment: 'Tavlanmış', 
            yieldStrength: { value: '205-240 MPa', standard: 'EN 10216-5' }, 
            uts: { value: '515-550 MPa', standard: 'EN 10216-5' }, 
            eModule: { value: '200 GPa', standard: '' }, 
            poisson: { value: '0.30', standard: '' }, 
            density: { value: '8.0 g/cm³', standard: '' }, 
            shearModule: { value: '78 GPa', standard: '' }, 
            thermalExp: { value: '16 µm/m-K', standard: '' }, 
            sourceName: 'ASM Handbook Vol 1: Properties and Selection: Irons and Steels', 
            sourceUrl: 'https://www.asminternational.org/materials-resources/handbooks' 
          }
        ]
      },
      {
        name: 'PH 17-4',
        alternateNames: ['1.4542', 'UNS S17400', 'AISI 630', 'Type 630'],
        data: [
          { 
            id: 'ph17-4-ati-h900', 
            materialName: '17-4 PH', 
            productionMethod: 'İşlenmiş (Çubuk/Levha)', 
            heatTreatment: 'H900', 
            yieldStrength: { value: '1170-1240 MPa', standard: 'ASTM A564' }, 
            uts: { value: '1310-1380 MPa', standard: 'ASTM A564' }, 
            eModule: { value: '197 GPa', standard: '' }, 
            poisson: { value: '0.27', standard: '' }, 
            density: { value: '7.8 g/cm³', standard: '' }, 
            shearModule: { value: '77 GPa', standard: '' }, 
            thermalExp: { value: '10.8 µm/m-K', standard: '' }, 
            sourceName: 'ATI Metals - 17-4 PH Technical Data Sheet', 
            sourceUrl: 'https://www.atimaterials.com/Products/Documents/datasheets/stainless-steel/precipitation-hardening/17-4%20PH%20Datasheet.pdf' 
          },
          { 
            id: 'ph17-4-ati-h1150', 
            materialName: '17-4 PH', 
            productionMethod: 'İşlenmiş', 
            heatTreatment: 'H1150', 
            yieldStrength: { value: '725 MPa', standard: 'ASTM A564' }, 
            uts: { value: '930 MPa', standard: 'ASTM A564' }, 
            eModule: { value: '197 GPa', standard: '' }, 
            poisson: { value: '0.27', standard: '' }, 
            density: { value: '7.8 g/cm³', standard: '' }, 
            shearModule: { value: '77 GPa', standard: '' }, 
            thermalExp: { value: '11.1 µm/m-K', standard: '' }, 
            sourceName: 'AK Steel / Cleveland-Cliffs - 17-4 PH Data', 
            sourceUrl: 'https://www.aksteel.nl/wp-content/uploads/2016/09/Armco-17-4-PH-Stainless-Steel.pdf' 
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
        alternateNames: ['POM-H', 'Asetal Homopolimer', 'Polyoxymethylene'],
        data: [
          { 
            id: 'delrin-150-jbm', 
            materialName: 'Delrin 150', 
            productionMethod: 'Ekstrüzyon (Çubuk/Levha)', 
            heatTreatment: 'Isıl İşlem Yok', 
            yieldStrength: { value: '75-76 MPa', standard: 'ASTM D638' }, 
            uts: { value: '75-76 MPa', standard: 'ASTM D638' }, 
            eModule: { value: '3.1 GPa', standard: '' }, 
            poisson: { value: '0.35', standard: '' }, 
            density: { value: '1.42 g/cm³', standard: '' }, 
            shearModule: { value: '1.1 GPa', standard: '' }, 
            thermalExp: { value: '110 µm/m-K', standard: '' }, 
            sourceName: 'Journal of Biomedical Materials Research - DOI: 10.1002/jbm.820190505', 
            sourceUrl: 'https://doi.org/10.1002/jbm.820190505' 
          },
          { 
            id: 'delrin-150-handbook', 
            materialName: 'Delrin 150', 
            productionMethod: 'Enjeksiyon Kalıplama', 
            heatTreatment: 'Isıl İşlem Yok', 
            yieldStrength: { value: '71 MPa', standard: 'ISO 527' }, 
            uts: { value: '71 MPa', standard: 'ISO 527' }, 
            eModule: { value: '3.0 GPa', standard: '' }, 
            poisson: { value: '0.35', standard: '' }, 
            density: { value: '1.42 g/cm³', standard: '' }, 
            shearModule: { value: '1.1 GPa', standard: '' }, 
            thermalExp: { value: '110 µm/m-K', standard: '' }, 
            sourceName: 'Polyoxymethylene Handbook - DOI: 10.1002/9781118914458.ch9', 
            sourceUrl: 'https://doi.org/10.1002/9781118914458.ch9' 
          }
        ]
      },
      {
        name: 'HDPE',
        alternateNames: ['High-Density Polyethylene', 'PE-HD', 'PE100', 'Polietilen'],
        data: [
          { 
            id: 'hdpe-pe100-plus', 
            materialName: 'HDPE PE100', 
            productionMethod: 'Ekstrüzyon (Boru)', 
            heatTreatment: 'Isıl İşlem Yok', 
            yieldStrength: { value: '23-26 MPa', standard: 'ISO 527' }, 
            uts: { value: '32-35 MPa', standard: 'ISO 527' }, 
            eModule: { value: '1000-1300 MPa', standard: 'ISO 178' }, 
            poisson: { value: '0.40', standard: '' }, 
            density: { value: '0.95-0.96 g/cm³', standard: 'ISO 1183' }, 
            shearModule: { value: '0.4 GPa', standard: '' }, 
            thermalExp: { value: '130-180 µm/m-K', standard: '' }, 
            sourceName: 'PE100+ Association - Technical Specifications', 
            sourceUrl: 'https://www.pe100plus.com/' 
          }
        ]
      }
    ]
  }
];
