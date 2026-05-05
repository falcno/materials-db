import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        {/* Placeholder for actual MILPOD logo */}
        <div className={styles.logo}>
          MILPOD
        </div>
        
        {/* Placeholder for actual YKSN logo */}
        <div className={styles.yksnLogo}>
          YKSN Denizcilik
        </div>
      </div>
      
      <div className={styles.title}>
        Denizcilik Malzeme Veritabanı
      </div>
    </header>
  );
}
