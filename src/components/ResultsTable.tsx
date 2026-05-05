import React from 'react';
import styles from './ResultsTable.module.css';

export interface MaterialProperty {
  value: string;
  standard?: string;
}

export interface SourceData {
  id: string;
  materialName: string;
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

  const renderProperty = (prop: MaterialProperty | null) => {
    if (!prop || !prop.value) return <span className={styles.missingData}>-</span>;
    return (
      <span>
        {prop.value} {prop.standard && <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>({prop.standard})</span>}
      </span>
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Malzeme</th>
            <th className={styles.th}>Akma Dayanımı</th>
            <th className={styles.th}>Çekme Dayanımı</th>
            <th className={styles.th}>Elastisite Modülü</th>
            <th className={styles.th}>Poisson Oranı</th>
            <th className={styles.th}>Yoğunluk</th>
            <th className={styles.th}>Kayma Modülü</th>
            <th className={styles.th}>Termal Genleşme</th>
            <th className={styles.th}>Kaynak</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className={styles.tr}>
              <td className={styles.td} style={{ fontWeight: 600 }}>{row.materialName}</td>
              <td className={styles.td}>{renderProperty(row.yieldStrength)}</td>
              <td className={styles.td}>{renderProperty(row.uts)}</td>
              <td className={styles.td}>{renderProperty(row.eModule)}</td>
              <td className={styles.td}>{renderProperty(row.poisson)}</td>
              <td className={styles.td}>{renderProperty(row.density)}</td>
              <td className={styles.td}>{renderProperty(row.shearModule)}</td>
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
  );
}
