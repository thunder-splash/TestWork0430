'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import Sidebar from '@/components/Sidebar/Sidebar';
import SearchBar from '@/components/SearchBar/SearchBar';
import TemperatureChart from '@/components/TemperatureChart/TemperatureChart';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import styles from './page.module.scss';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const { 
    currentWeather, 
    forecast,
    weatherLoading, 
    forecastLoading,
    error, 
    fetchWeather, 
    fetchForecast,
    clearError,
    setSearchCity,
    favorites,
    addToFavorites,
    removeFromFavorites
  } = useWeatherStore();

  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');
  const [initialLoad, setInitialLoad] = useState(true);

  // Загрузка погоды при первом рендере с учетом параметров URL и сохраненного города
  useEffect(() => {
    if (initialLoad) {
      // Приоритет: 1) параметр URL, 2) сохраненный город, 3) Москва
      const savedCity = localStorage.getItem('lastCity');
      
      if (cityParam) {
        fetchWeather(cityParam);
        fetchForecast(cityParam);
        setSearchCity(cityParam);
        localStorage.setItem('lastCity', cityParam);
      } else if (savedCity) {
        fetchWeather(savedCity);
        fetchForecast(savedCity);
        setSearchCity(savedCity);
      } else {
        fetchWeather('Москва');
        fetchForecast('Москва');
        setSearchCity('Москва');
        localStorage.setItem('lastCity', 'Москва');
      }
      
      setInitialLoad(false);
    }
  }, [initialLoad, cityParam, fetchWeather, fetchForecast, setSearchCity]);

  // Обработчик поиска
  const handleSearch = (city: string) => {
    fetchWeather(city);
    fetchForecast(city);
    setSearchCity(city);
    localStorage.setItem('lastCity', city);
  };

  // Получаем текущую дату
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Погода сейчас</h1>
          
          {currentWeather && (
            <div className={styles.cityTitle}>
              <h2>{currentWeather.name}, {currentWeather.sys.country}</h2>
            </div>
          )}
          
          <div className={styles.searchBarContainer}>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {error && (
            <div className={styles.errorAlert}>
              {error}
              <button 
                type="button" 
                className={styles.closeButton} 
                onClick={clearError}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className={styles.contentContainer}>
            {weatherLoading === 'loading' && <LoadingSpinner message="Загрузка погоды..." />}
            
            {weatherLoading === 'success' && currentWeather && forecastLoading === 'success' && forecast && (
              <div className={styles.weatherInfoBlock}>
                <div className={styles.weatherInfoLeft}>
                  <div className={styles.dateInfo}>{formattedDate}</div>
                  <div className={styles.weatherMainInfo}>
                    <div className={styles.weatherIcon}>
                      <Image 
                        src={`https://openweathermap.org/img/wn/${currentWeather.weather[0]?.icon}@2x.png`}
                        alt={currentWeather.weather[0]?.description || 'Погода'}
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className={styles.temperatureBlock}>
                      <div className={styles.temperature}>
                        {Math.round(currentWeather.main.temp)}°C
                      </div>
                      <div className={styles.description}>
                        {currentWeather.weather[0]?.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Добавляем кнопку избранного */}
                  <div className={styles.favoriteButtonContainer}>
                    <button 
                      className={styles.favoriteButton}
                      onClick={() => {
                        const isFavorite = favorites.some((city: { id: string }) => city.id === currentWeather.id.toString());
                        if (isFavorite) {
                          removeFromFavorites(currentWeather.id.toString());
                        } else {
                          addToFavorites({
                            id: currentWeather.id.toString(),
                            name: currentWeather.name,
                            country: currentWeather.sys.country,
                            coord: currentWeather.coord
                          });
                        }
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={favorites.some((city: { id: string }) => city.id === currentWeather.id.toString()) ? "#FFD700" : "none"} stroke={favorites.some((city: { id: string }) => city.id === currentWeather.id.toString()) ? "#FFD700" : "currentColor"} strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      {favorites.some((city: { id: string }) => city.id === currentWeather.id.toString()) ? 'Удалить из избранного' : 'Добавить в избранное'}
                    </button>
                  </div>
                  
                  <div className={styles.weatherDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Ощущается как:</span>
                      <span className={styles.detailValue}>{Math.round(currentWeather.main.feels_like)}°C</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Влажность:</span>
                      <span className={styles.detailValue}>{currentWeather.main.humidity}%</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Ветер:</span>
                      <span className={styles.detailValue}>{Math.round(currentWeather.wind.speed)} м/с</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Давление:</span>
                      <span className={styles.detailValue}>{Math.round(currentWeather.main.pressure * 0.75)} мм рт.ст.</span>
                    </div>
                  </div>
                </div>
                <div className={styles.weatherInfoRight}>
                  <TemperatureChart forecast={forecast} />
                </div>
              </div>
            )}
            
            {weatherLoading === 'idle' && !currentWeather && (
              <div className={styles.emptyState}>
                <p>Введите название города для просмотра погоды</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner message="Загрузка страницы..." />}>
      <HomeContent />
    </Suspense>
  );
}
