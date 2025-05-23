'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeatherStore } from '@/store/weatherStore';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './page.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function FavoritesPage() {
  const { 
    favorites, 
    removeFromFavorites,
    fetchFavoriteWeather,
    favoritesWeather,
    favoritesLoading
  } = useWeatherStore();
  
  const router = useRouter();

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteWeather();
    }
  }, [favorites, fetchFavoriteWeather]);

  const handleRemoveFromFavorites = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromFavorites(id);
  };

  const handleCardClick = (cityName: string) => {
    router.push(`/?city=${cityName}`);
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Избранные города</h1>
          
          {favorites.length === 0 ? (
            <div className={styles.emptyState}>
              <p>У вас пока нет избранных городов</p>
              <Link href="/" className={styles.linkButton}>
                Вернуться на главную
              </Link>
            </div>
          ) : (
            <div className={styles.favoritesGrid}>
              {favorites.map(city => {
                const cityWeather = favoritesWeather[city.id];
                
                return (
                  <div 
                    key={city.id} 
                    className={styles.favoriteCard}
                    onClick={() => handleCardClick(city.name)}
                  >
                    <div className={styles.favoriteCardHeader}>
                      <h3 className={styles.cityName}>{city.name}, {city.country}</h3>
                      <button 
                        className={styles.removeButton}
                        onClick={(e) => handleRemoveFromFavorites(city.id, e)}
                        aria-label="Удалить из избранного"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {favoritesLoading[city.id] === 'loading' && (
                      <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                      </div>
                    )}
                    
                    {favoritesLoading[city.id] === 'error' && (
                      <div className={styles.errorState}>
                        Не удалось загрузить данные
                      </div>
                    )}
                    
                    {favoritesLoading[city.id] === 'success' && cityWeather && (
                      <div className={styles.weatherInfo}>
                        <div className={styles.weatherMain}>
                          <div className={styles.weatherIcon}>
                            <Image 
                              src={`https://openweathermap.org/img/wn/${cityWeather.weather[0]?.icon}@2x.png`}
                              alt={cityWeather.weather[0]?.description || 'Погода'}
                              width={60}
                              height={60}
                            />
                          </div>
                          <div className={styles.temperature}>
                            {Math.round(cityWeather.main.temp)}°C
                          </div>
                        </div>
                        
                        <div className={styles.weatherDescription}>
                          {cityWeather.weather[0]?.description}
                        </div>
                        
                        <div className={styles.weatherDetails}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Влажность:</span>
                            <span className={styles.detailValue}>{cityWeather.main.humidity}%</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Ветер:</span>
                            <span className={styles.detailValue}>{Math.round(cityWeather.wind.speed)} м/с</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}