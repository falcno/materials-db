'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import ResultsTable, { SourceData } from '../components/ResultsTable';
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

        try {
                const response = await fetch('/api/search', {
                          method: 'POST',
                          headers: {
                                      'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ query }),
                });

          if (!response.ok) {
                    let errorMsg = 'Veri cekilirken bir hata olustu';
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
                      </aside>aside>
              
                      <main className={styles.mainContent}>
                                <div className={styles.hero}>
                                            <h1 className={styles.title}>Denizcilik Malzeme Veritabani</h1>h1>
                                            <p className={styles.subtitle}>
                                                          Muhendislik ve bilimsel kaynaklari tarayarak malzeme ozelliklerini, standartlari ve referanslari aninda bulun.
                                            </p>p>
                                </div>div>
                      
                                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                      
                        {isLoading && (
                      <div className={styles.loader}>
                                    <div className={styles.spinner}></div>div>
                                    <p>Literatur ve veritabanlari taraniyor... Birden fazla kaynak toplandigi icin bu islem birkac saniye surebilir.</p>p>
                      </div>div>
                                )}
                      
                        {warning && !isLoading && (
                      <div style={{ background: 'rgba(255, 165, 0, 0.1)', color: '#cc7700', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem', border: '1px solid orange' }}>
                                    <strong>DIKKAT:</strong>strong> {warning}
                      </div>div>
                                )}
                      
                        {error && (
                      <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
                        {error}
                      </div>div>
                                )}
                      
                        {!isLoading && data.length > 0 && <ResultsTable data={data} />}
                      </main>main>
              </div>div>
        </>>
      );
}
</>
