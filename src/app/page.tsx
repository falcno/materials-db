'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import ResultsTable, { SourceData } from '../components/ResultsTable';
import { PREDEFINED_MATERIALS } from '../data/predefinedMaterials';
import styles from './page.module.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SourceData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setData([]);

    // Check predefined materials first for consistency
    const lowerQuery = query.toLowerCase();
    let foundPredefined = false;

    for (const category of PREDEFINED_MATERIALS) {
      const match = category.materials.find(m => 
        m.name.toLowerCase() === lowerQuery || 
        m.alternateNames?.some(alt => alt.toLowerCase() === lowerQuery)
      );

      if (match) {
        setData(match.data);
        setIsLoading(false);
        foundPredefined = true;
        break;
      }
    }

    if (foundPredefined) return;

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        let errorMsg = 'Veri çekilirken bir hata oluştu';
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const result = await response.json();
      setData(result.data);
      if (result.warning) setWarning(result.warning);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMaterial = (materialData: SourceData[]) => {
    setData(materialData);
    setWarning(null);
    setError(null);
  };

  return (
    <>
      <Header />
      <div className={styles.pageLayout}>
        <aside className={styles.sidebarSection}>
          <Sidebar onSelectMaterial={handleSelectMaterial} />
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Denizcilik Malzeme Veritabanı</h1>
            <p className={styles.subtitle}>
              Mühendislik ve bilimsel kaynakları tarayarak malzeme özelliklerini, standartları ve referansları anında bulun.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {isLoading && (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              <p>Literatür ve veritabanları taranıyor... Birden fazla kaynak toplandığı için bu işlem birkaç saniye sürebilir.</p>
            </div>
          )}

          {warning && !isLoading && (
            <div style={{ background: 'rgba(255, 165, 0, 0.1)', color: '#cc7700', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem', border: '1px solid orange' }}>
              <strong>DİKKAT:</strong> {warning}
            </div>
          )}

          {error && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
              {error}
            </div>
          )}

          {!isLoading && data.length > 0 && <ResultsTable data={data} />}
        </main>
      </div>
    </>
  );
}
