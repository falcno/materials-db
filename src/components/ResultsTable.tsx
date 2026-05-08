import React from 'react';
import styles from './ResultsTable.module.css';

export interface MaterialProperty {
  value: string;
  standard?: string;
}

export interface SourceData {
  id: string;
  materialName: string;
  alternateNames?: string[];
  productionMethod: string;
  heatTreatment: string;
  yieldStrength: MaterialProperty | null;
  uts: MaterialProperty | null;
  eModule: MaterialProperty | null;
  poisson: MaterialProperty | null;
  density: MaterialProperty | null;
  shearModule: MaterialProperty | null;
  thermalExp: MaterialProperty | null;
  sourceName: string;
  sourceUrl?: string;
}

interface ResultsTableProps {
  data: SourceData[];
}

export default function ResultsTable({ data }: ResultsTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Group data by production method
  const groupedData: { [key: string]: SourceData[] } = data.reduce((acc, item) => {
    const method = item.productionMethod || 'Diğer';
    if (!acc[method]) acc[method] = [];
    acc[method].push(item);
    return acc;
  }, {} as { [key: string]: SourceData[] });

  const renderProperty = (prop: MaterialProperty | null) => {
    if (!prop || !prop.value) return <span className={styles.missingData}>-</span>;
    return (
      <span>
        {prop.value} {prop.standard && <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>({prop.standard})</span>}
      </span>
    );
  };

  return (
    <div className={styles.resultsWrapper}>
      {Object.keys(groupedData).map((method) => (
        <div key={method} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{method}</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Malzeme</th>
                  <th className={styles.th}>Isıl İşlem</th>
                  <th className={styles.th}>Akma Dayanımı</th>
                  <th className={styles.th}>Çekme Dayanımı</th>
                  <th className={styles.th}>Elastisite Modülü</th>
                  <th className={styles.th}>Yoğunluk</th>
                  <th className={styles.th}>Termal Genleşme</th>
                  <th className={styles.th}>Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {groupedData[method].map((row) => (
                  <tr key={row.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontWeight: 600 }}>
                      <div>{row.materialName}</div>
                      {row.alternateNames && row.alternateNames.length > 0 && (
                        <div className={styles.alternateNames}>
                          {row.alternateNames.join(' / ')}
                        </div>
                      )}
                    </td>
                    <td className={styles.td}>{row.heatTreatment || '-'}</td>
                    <td className={styles.td}>{renderProperty(row.yieldStrength)}</td>
                    <td className={styles.td}>{renderProperty(row.uts)}</td>
                    <td className={styles.td}>{renderProperty(row.eModule)}</td>
                    <td className={styles.td}>{renderProperty(row.density)}</td>
                    <td className={styles.td}>{renderProperty(row.thermalExp)}</td>
                    <td className={styles.td}>
                      {row.sourceUrl ? (
                        <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                          {row.sourceName}
                        </a>
                      ) : (
                        <span className={styles.sourceText}>{row.sourceName}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
