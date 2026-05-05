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
            <th className={styles.th}>Material</th>
            <th className={styles.th}>Yield Strength</th>
            <th className={styles.th}>Ult. Tensile Strength</th>
            <th className={styles.th}>E-Module</th>
            <th className={styles.th}>Poisson Value</th>
            <th className={styles.th}>Density</th>
            <th className={styles.th}>Shear Module</th>
            <th className={styles.th}>Thermal Exp.</th>
            <th className={styles.th}>Source</th>
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
