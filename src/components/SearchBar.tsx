'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';
import { Search } from 'lucide-react';

const SUGGESTIONS = [
  '316L Stainless Steel', 'AlSi10Mg7', 'Delrin (POM)', 'HDPE-100', 'Cu3',
  'Titanium Ti-6Al-4V', 'Aluminum 6061-T6', 'Carbon Steel A36', 'Nylon 6/6',
  'Polycarbonate (PC)', 'ABS Plastic', 'Brass (C36000)', 'Bronze (C93200)',
  'Teflon (PTFE)', 'PVC', 'Graphene', 'Inconel 718', 'Copper (C11000)',
  'Epoxy Resin', 'Kevlar', 'Silicone Rubber'
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = SUGGESTIONS.filter(
    (item) => item.toLowerCase().includes(query.toLowerCase()) && item !== query
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className={styles.searchContainer} ref={wrapperRef}>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <Search className={styles.icon} size={20} />
        <input
          type="text"
          className={styles.input}
          placeholder="Search materials (e.g. 316L, Delrin)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading || !query.trim()}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && query.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
