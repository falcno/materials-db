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
          { id: 'alsi10mg-eos', materialName: 'AlSi10Mg', productionMethod: 'LPBF (Lazer Toz Yatağı)', heatTreatment: 'Gerilim Giderilmiş', yieldStrength: { value: '240 MPa', standard: 'ASTM E8' }, uts: { value: '345 MPa', standard: 'ASTM E8' }, eModule: { value: '70 GPa', standard: '' }, poisson: { value: '0.33', standard: '' }, density: { value: '2.67 g/cm³', standard: '' }, shearModule: { value: '26 GPa', standard: '' }, thermalExp: { value: '23 µm/m-K', standard: '' }, sourceName: 'EOS - AlSi10Mg Teknik Veri Föyü', sourceUrl: 'https://www.eos.info/en/materials/metal/aluminum/alsi10mg' },
          { id: 'alsi10mg-slm-asbuilt', materialName: 'AlSi10Mg', productionMethod: 'SLM', heatTreatment: 'Üretildiği Gibi', yieldStrength: { value: '270 MPa', standard: '' }, uts: { value: '415 MPa', standard: '' }, eModule: { value: '75 GPa', standard: '' }, poisson: { value: '0.33', standard: '' }, density: { value: '2.68 g/cm³', standard: '' }, shearModule: { value: '28 GPa', standard: '' }, thermalExp: { value: '23 µm/m-K', standard: '' }, sourceName: 'SLM Solutions - Malzeme Özellikleri', sourceUrl: 'https://www.slm-solutions.com/products-and-solutions/materials/aluminum-alloys/' },
          { id: 'alsi10mg-casting', materialName: 'AlSi10Mg', productionMethod: 'Kuma Döküm', heatTreatment: 'T6', yieldStrength: { value: '110 MPa', standard: '' }, uts: { value: '200 MPa', standard: '' }, eModule: { value: '71 GPa', standard: '' }, poisson: { value: '0.33', standard: '' }, density: { value: '2.65 g/cm³', standard: '' }, shearModule: { value: '26 GPa', standard: '' }, thermalExp: { value: '21 µm/m-K', standard: '' }, sourceName: 'MatWeb - Aluminum AlSi10Mg Cast Alloy', sourceUrl: 'https://www.matweb.com/search/DataSheet.aspx?MatGUID=c4819782811440cc9a4197e4e0821616' }
        ]
      },
      {
        name: 'A356',
        alternateNames: ['EN AC-42100', 'EN AC-AlSi7Mg0,3', '3.2371', 'A356.0'],
        data: [
          { id: 'a356-permanent-mold', materialName: 'A356.0', productionMethod: 'Kokil Döküm', heatTreatment: 'T6', yieldStrength: { value: '205 MPa', standard: 'ASTM B108' }, uts: { value: '280 MPa', standard: 'ASTM B108' }, eModule: { value: '72.4 GPa', standard: '' }, poisson: { value: '0.33', standard: '' }, density: { value: '2.68 g/cm³', standard: '' }, shearModule: { value: '27.2 GPa', standard: '' }, thermalExp: { value: '21.4 µm/m-K', standard: '' }, sourceName: 'ASM International - A356.0-T6 Properties', sourceUrl: 'https://products.asminternational.org/search/index.do' },
          { id: 'a356-sand-cast', materialName: 'A356.0', productionMethod: 'Kuma Döküm', heatTreatment: 'T6', yieldStrength: { value: '165 MPa', standard: 'ASTM B26' }, uts: { value: '235 MPa', standard: 'ASTM B26' }, eModule: { value: '72.4 GPa', standard: '' }, poisson: { value: '0.33', standard: '' }, density: { value: '2.67 g/cm³', standard: '' }, shearModule: { value: '27.2 GPa', standard: '' }, thermalExp: { value: '21.5 µm/m-K', standard: '' }, sourceName: 'MatWeb - Aluminum A356.0-T6 Sand Cast', sourceUrl: 'https://www.matweb.com/search/DataSheet.aspx?MatGUID=c4819782811440cc9a4197e4e0821616' }
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
          { id: 'cu3-ampco-forged', materialName: 'CuAl10Ni5Fe4', productionMethod: 'Dövme', heatTreatment: 'Tavlanmış', yieldStrength: { value: '380 MPa', standard: '' }, uts: { value: '680 MPa', standard: '' }, eModule: { value: '115 GPa', standard: '' }, poisson: { value: '0.34', standard: '' }, density: { value: '7.58 g/cm³', standard: '' }, shearModule: { value: '44 GPa', standard: '' }, thermalExp: { value: '16.2 µm/m-K', standard: '' }, sourceName: 'AMPCO Metal - CuAl10Ni5Fe4 Teknik Veri Föyü', sourceUrl: 'https://www.ampcometal.com/products/cu-al10-ni5-fe4/' },
          { id: 'cu3-metalcor-wrought', materialName: 'CuAl10Ni5Fe4', productionMethod: 'İşlenmiş (Wrought)', heatTreatment: 'Tavlanmış', yieldStrength: { value: '450 MPa', standard: 'DIN 17665' }, uts: { value: '740 MPa', standard: 'DIN 17665' }, eModule: { value: '115 GPa', standard: '' }, poisson: { value: '0.34', standard: '' }, density: { value: '7.6 g/cm³', standard: '' }, shearModule: { value: '44 GPa', standard: '' }, thermalExp: { value: '16 µm/m-K', standard: '' }, sourceName: 'Metalcor - 2.0966 Datasheet', sourceUrl: 'https://www.metalcor.de/en/datasheet/2.0966-cual10ni5fe4/' },
          { id: 'cu3-c63000-wrought', materialName: 'C63000 (NAB)', productionMethod: 'Sıcak Haddelenmiş', heatTreatment: 'Annealed', yieldStrength: { value: '345 MPa', standard: 'ASTM B150' }, uts: { value: '690 MPa', standard: 'ASTM B150' }, eModule: { value: '121 GPa', standard: '' }, poisson: { value: '0.34', standard: '' }, density: { value: '7.58 g/cm³', standard: '' }, shearModule: { value: '45 GPa', standard: '' }, thermalExp: { value: '16.2 µm/m-K', standard: '' }, sourceName: 'Aviva Metals - C63000 NAB Data', sourceUrl: 'https://www.avivametals.com/alloys/nickel-aluminum-bronzes/c63000/' }
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
          { id: '316l-sandmeyer-wrought', materialName: '316L', productionMethod: 'İşlenmiş (Sac/Levha)', heatTreatment: 'Tavlanmış', yieldStrength: { value: '290 MPa', standard: 'ASTM A240' }, uts: { value: '580 MPa', standard: 'ASTM A240' }, eModule: { value: '193 GPa', standard: '' }, poisson: { value: '0.30', standard: '' }, density: { value: '8.0 g/cm³', standard: '' }, shearModule: { value: '77 GPa', standard: '' }, thermalExp: { value: '16 µm/m-K', standard: '' }, sourceName: 'Sandmeyer Steel - 316/316L Spesifikasyon Sayfası', sourceUrl: 'https://www.sandmeyersteel.com/images/316-316L-317L-Spec-Sheet.pdf' },
          { id: '316l-outokumpu', materialName: '1.4404 (316L)', productionMethod: 'Soğuk Haddelenmiş', heatTreatment: 'Tavlanmış', yieldStrength: { value: '280 MPa', standard: 'EN 10088-2' }, uts: { value: '580 MPa', standard: 'EN 10088-2' }, eModule: { value: '200 GPa', standard: '' }, poisson: { value: '0.30', standard: '' }, density: { value: '8.0 g/cm³', standard: '' }, shearModule: { value: '78 GPa', standard: '' }, thermalExp: { value: '16 µm/m-K', standard: '' }, sourceName: 'Outokumpu - Stainless Steel Handbook', sourceUrl: 'https://www.outokumpu.com/en/expertise/2021/stainless-steel-handbook' },
          { id: '316l-casting-cf3m', materialName: 'CF3M (316L Döküm)', productionMethod: 'Kuma Döküm', heatTreatment: 'Çözeltiye Alınmış Tavlı', yieldStrength: { value: '205 MPa', standard: 'ASTM A351' }, uts: { value: '485 MPa', standard: 'ASTM A351' }, eModule: { value: '190 GPa', standard: '' }, poisson: { value: '0.30', standard: '' }, density: { value: '7.75 g/cm³', standard: '' }, shearModule: { value: '75 GPa', standard: '' }, thermalExp: { value: '15.5 µm/m-K', standard: '' }, sourceName: 'MakeItFrom - CF3M Stainless Steel Data', sourceUrl: 'https://www.makeitfrom.com/material-properties/ACI-ASTM-CF3M-Stainless-Steel' }
        ]
      },
      {
        name: 'PH 17-4',
        alternateNames: ['1.4542', 'UNS S17400', 'AISI 630', 'Type 630'],
        data: [
          { id: 'ph17-4-ati-h900', materialName: '17-4 PH', productionMethod: 'İşlenmiş (Çubuk/Levha)', heatTreatment: 'H900', yieldStrength: { value: '1170 MPa', standard: 'ASTM A564' }, uts: { value: '1310 MPa', standard: 'ASTM A564' }, eModule: { value: '197 GPa', standard: '' }, poisson: { value: '0.27', standard: '' }, density: { value: '7.8 g/cm³', standard: '' }, shearModule: { value: '77 GPa', standard: '' }, thermalExp: { value: '10.8 µm/m-K', standard: '' }, sourceName: 'ATI Metals - 17-4 PH Teknik Veri Föyü', sourceUrl: 'https://www.atimaterials.com/Products/Documents/datasheets/stainless-steel/precipitation-hardening/17-4%20PH%20Datasheet.pdf' },
          { id: 'ph17-4-ati-h1150', materialName: '17-4 PH', productionMethod: 'İşlenmiş', heatTreatment: 'H1150', yieldStrength: { value: '725 MPa', standard: 'ASTM A564' }, uts: { value: '930 MPa', standard: 'ASTM A564' }, eModule: { value: '197 GPa', standard: '' }, poisson: { value: '0.27', standard: '' }, density: { value: '7.8 g/cm³', standard: '' }, shearModule: { value: '77 GPa', standard: '' }, thermalExp: { value: '11.1 µm/m-K', standard: '' }, sourceName: 'ATI Metals - 17-4 PH Technical Data', sourceUrl: 'https://www.atimaterials.com/Products/Documents/datasheets/stainless-steel/precipitation-hardening/17-4%20PH%20Datasheet.pdf' }
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
          { id: 'delrin-150-extruded', materialName: 'Delrin 150', productionMethod: 'Ekstrüzyon (Çubuk/Levha)', heatTreatment: 'Isıl İşlem Yok', yieldStrength: { value: '70 MPa', standard: 'ASTM D638' }, uts: { value: '70 MPa', standard: 'ASTM D638' }, eModule: { value: '3.1 GPa', standard: '' }, poisson: { value: '0.35', standard: '' }, density: { value: '1.42 g/cm³', standard: '' }, shearModule: { value: '1.1 GPa', standard: '' }, thermalExp: { value: '110 µm/m-K', standard: '' }, sourceName: 'Plastics International - Delrin 150 Data', sourceUrl: 'https://www.plasticsintl.com/delrin-150-homopolymer-acetal' }
        ]
      },
      {
        name: 'HDPE',
        alternateNames: ['High-Density Polyethylene', 'PE-HD', 'PE100', 'Polietilen'],
        data: [
          { id: 'hdpe-pe100-plus', materialName: 'HDPE PE100', productionMethod: 'Ekstrüzyon (Boru)', heatTreatment: 'Isıl İşlem Yok', yieldStrength: { value: '25 MPa', standard: 'ISO 527' }, uts: { value: '32 MPa', standard: 'ISO 527' }, eModule: { value: '1.1 GPa', standard: '' }, poisson: { value: '0.40', standard: '' }, density: { value: '0.96 g/cm³', standard: '' }, shearModule: { value: '0.4 GPa', standard: '' }, thermalExp: { value: '180 µm/m-K', standard: '' }, sourceName: 'PE100+ Association - Teknik Özellikler', sourceUrl: 'https://www.pe100plus.com/' }
        ]
      }
    ]
  }
];
