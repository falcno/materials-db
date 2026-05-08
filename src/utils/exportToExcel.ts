import * as XLSX from 'xlsx';
import { SourceData } from '../components/ResultsTable';

/**
 * Exports material data to an Excel file, categorized by production method.
 * @param data Array of SourceData to export
 * @param fileName Base name of the file
 */
export const exportToExcel = (data: SourceData[], fileName: string = 'malzeme_verileri') => {
  if (!data || data.length === 0) return;

  // Group data by production method
  const groupedData: { [key: string]: SourceData[] } = data.reduce((acc, item) => {
    const method = item.productionMethod || 'Diğer';
    if (!acc[method]) acc[method] = [];
    acc[method].push(item);
    return acc;
  }, {} as { [key: string]: SourceData[] });

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create a sheet for each production method
  Object.keys(groupedData).forEach((method) => {
    // Transform data for the sheet
    const sheetData = groupedData[method].map((row) => ({
      'Malzeme Adı': row.materialName,
      'Alternatif İsimler': row.alternateNames?.join(', ') || '-',
      'Üretim Yöntemi': row.productionMethod,
      'Isıl İşlem': row.heatTreatment || '-',
      'Akma Dayanımı': row.yieldStrength?.value || '-',
      'Çekme Dayanımı': row.uts?.value || '-',
      'Elastisite Modülü': row.eModule?.value || '-',
      'Poisson Oranı': row.poisson?.value || '-',
      'Yoğunluk': row.density?.value || '-',
      'Kayma Modülü': row.shearModule?.value || '-',
      'Termal Genleşme': row.thermalExp?.value || '-',
      'Kaynak': row.sourceName,
      'Kaynak Linki': row.sourceUrl || '-',
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // Set column widths
    const maxWidths = [
      { wch: 20 }, // Malzeme Adı
      { wch: 30 }, // Alternatif İsimler
      { wch: 25 }, // Üretim Yöntemi
      { wch: 20 }, // Isıl İşlem
      { wch: 15 }, // Akma Dayanımı
      { wch: 15 }, // Çekme Dayanımı
      { wch: 18 }, // Elastisite Modülü
      { wch: 12 }, // Poisson Oranı
      { wch: 15 }, // Yoğunluk
      { wch: 15 }, // Kayma Modülü
      { wch: 18 }, // Termal Genleşme
      { wch: 40 }, // Kaynak
      { wch: 50 }, // Kaynak Linki
    ];
    worksheet['!cols'] = maxWidths;

    // Add worksheet to workbook
    // Sheet name must be <= 31 chars
    const sheetName = method.length > 31 ? method.substring(0, 28) + '...' : method;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Export the file
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
