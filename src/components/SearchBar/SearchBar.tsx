// Оптимизированный код:
'use client';

import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.scss';
import { searchCities } from '@/services/weatherService';

interface SearchBarProps {
  onSearch: (city: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Array<{id: string, name: string, country: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 3) {
      setIsLoading(true);
      try {
        const cities = await searchCities(value);
        setSuggestions(cities);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching cities:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setSearchTerm(city);
    onSearch(city);
    setShowSuggestions(false);
  };

  return (
    <div className={styles.searchBarContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Введите название города..."
            className={styles.searchInput}
            aria-label="Поиск города"
          />
          <button 
            type="submit" 
            className={styles.searchButton}
            aria-label="Найти"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsContainer}>
            {suggestions.map((city) => (
              <div 
                key={city.id} 
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(city.name)}
              >
                {city.name}, {city.country}
              </div>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className={styles.suggestionsContainer}>
            <div className={styles.suggestionItem}>
              Загрузка...
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
