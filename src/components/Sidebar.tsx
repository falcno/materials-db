'use client';

import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { ChevronDown, ChevronRight, Folder, FileText, Database } from 'lucide-react';
import { PREDEFINED_MATERIALS } from '../data/predefinedMaterials';
import { SourceData } from './ResultsTable';

interface SidebarProps {
  onSelectMaterial: (data: SourceData[]) => void;
}

export default function Sidebar({ onSelectMaterial }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Alüminyum Alaşımları': true,
    'Paslanmaz Çelikler': true,
    'Bakır Alaşımları': true,
    'Polimerler': true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Database size={20} className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>Malzeme Kütüphanesi</h2>
      </div>
      
      <div className={styles.treeContainer}>
        {PREDEFINED_MATERIALS.map((category) => (
          <div key={category.name} className={styles.categoryWrapper}>
            <div 
              className={styles.categoryHeader} 
              onClick={() => toggleCategory(category.name)}
            >
              {expandedCategories[category.name] ? (
                <ChevronDown size={16} className={styles.arrow} />
              ) : (
                <ChevronRight size={16} className={styles.arrow} />
              )}
              <Folder size={18} className={styles.folderIcon} />
              <span className={styles.categoryName}>{category.name}</span>
            </div>
            
            {expandedCategories[category.name] && (
              <div className={styles.materialsList}>
                {category.materials.map((material) => (
                  <div 
                    key={material.name} 
                    className={styles.materialItem}
                    onClick={() => onSelectMaterial(material.data)}
                  >
                    <FileText size={16} className={styles.fileIcon} />
                    <div className={styles.materialInfo}>
                      <span className={styles.materialName}>{material.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
