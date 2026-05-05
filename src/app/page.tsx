'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ResultsTable, { SourceData } from '../components/ResultsTable';
import styles from './page.module.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SourceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
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
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Marine Material Database</h1>
          <p className={styles.subtitle}>
            Search across multiple engineering and scientific sources to find precise material properties, standards, and references instantly.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Scanning literature and databases... This might take a few seconds as we gather multiple sources.</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
            {error}
          </div>
        )}

        {!isLoading && data.length > 0 && <ResultsTable data={data} />}
      </main>
    </>
  );
}
