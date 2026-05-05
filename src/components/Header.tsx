import React from 'react';
import styles from './Header.module.css';
import { Anchor } from 'lucide-react';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        {/* Placeholder for actual MILPOD logo */}
        <div className={styles.logo}>
          <Anchor size={28} />
          MILPOD
        </div>
        
        {/* Placeholder for actual YKSN logo */}
        <div className={styles.yksnLogo}>
          YKSN Denizcilik
        </div>
      </div>
      
      <div className={styles.title}>
        Marine Material Database
      </div>
    </header>
  );
}
