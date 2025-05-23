'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWeatherStore } from '@/store/weatherStore';
import SearchBar from '@/components/SearchBar/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './page.module.scss';
import Image from 'next/image';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

function ForecastPageContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');
  
  const { 
    forecast,
    forecastLoading,
    error, 
    fetchForecast,
    searchCity,
    clearError
  } = useWeatherStore();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    if (cityParam) {
      fetchForecast(cityParam);
    } else if (searchCity) {
      fetchForecast(searchCity);
    }
  }, [cityParam, searchCity, fetchForecast]);

  const handleSearch = (city: string) => {
    fetchForecast(city);
  };

  const groupForecastByDay = () => {
    if (!forecast || !forecast.list) return [];
    
    interface DayData {
      date: Date;
      items: Array<{
        dt: number;
        main: { temp: number };
        weather: Array<{ icon?: string; description?: string }>;
      }>;
    }
    
    const days: Record<string, DayData> = {};
    
    forecast.list.forEach((item: {
      dt: number;
      main: { temp: number };
      weather: Array<{ icon?: string; description?: string }>;
    }) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('ru-RU');
      
      if (!days[day]) {
        days[day] = {
          date: date,
          items: []
        };
      }
      
      days[day].items.push(item);
    });
    
    return Object.values(days);
  };

  const forecastDays = groupForecastByDay();
  const selectedDay = forecastDays[selectedDayIndex];
  
  const prepareChartData = () => {
    if (!selectedDay || !selectedDay.items) return [];
    
    return selectedDay.items.map(item => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(item.main.temp),
        icon: item.weather[0]?.icon,
        description: item.weather[0]?.description,
        dt: item.dt
      };
    });
  };

  const chartData = prepareChartData();

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Прогноз погоды</h1>

          {forecast && forecast.city && (
            <div className={styles.cityTitle}>
              <h2>{forecast.city.name}, {forecast.city.country}</h2>
            </div>
          )}
          
          <div className={styles.searchContainer}>
            <SearchBar onSearch={handleSearch} initialValue={searchCity} />
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
            {forecastLoading === 'loading' && <LoadingSpinner message="Загрузка прогноза..." />}
            
            {forecastLoading === 'success' && forecast && (
              <>
                <div className={styles.daysContainer}>
                  {forecastDays.map((day, index) => {
                    if (!day.items || day.items.length === 0) return null;
                    
                    const midDayItem = day.items.find(item => {
                      const hour = new Date(item.dt * 1000).getHours();
                      return hour >= 12 && hour <= 15;
                    }) || day.items[0];
                    
                    const date = day.date;
                    const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
                    const dayNumber = date.getDate();
                    const month = date.toLocaleDateString('ru-RU', { month: 'short' });
                    
                    return (
                      <div 
                        key={index}
                        className={`${styles.dayCard} ${index === selectedDayIndex ? styles.selectedDay : ''}`}
                        onClick={() => setSelectedDayIndex(index)}
                      >
                        <div className={styles.dayHeader}>
                          <div className={styles.dayName}>{dayName}</div>
                          <div className={styles.dayDate}>{dayNumber} {month}</div>
                        </div>
                        
                        <div className={styles.dayIcon}>
                          <Image 
                            src={`https://openweathermap.org/img/wn/${midDayItem.weather[0]?.icon}@2x.png`}
                            alt={midDayItem.weather[0]?.description || 'Погода'}
                            width={60}
                            height={60}
                          />
                        </div>
                        
                        <div className={styles.dayTemp}>
                          {Math.round(midDayItem.main.temp)}°C
                        </div>
                        
                        <div className={styles.dayDescription}>
                          {midDayItem.weather[0]?.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className={styles.weatherInfoRight}>
                  <h3 className={styles.chartTitle}>Почасовой прогноз</h3>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                      >
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4DA6FF" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4DA6FF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12, fill: '#666' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#666' }}
                          domain={['dataMin - 2', 'dataMax + 2']}
                          tickFormatter={(value) => `${value}°`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}°C`, 'Температура']}
                          labelFormatter={(label) => `Время: ${label}`}
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: 'none', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#4DA6FF" 
                          fillOpacity={1} 
                          fill="url(#colorTemp)" 
                          strokeWidth={2}
                        />
                        {chartData.map((entry, index) => (
                          <g key={index}>
                            <image
                              x={index * 50}
                              y={50}
                              width={20}
                              height={20}
                              href={`https://openweathermap.org/img/wn/${entry.icon}@2x.png`}
                            />
                          </g>
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
            
            {forecastLoading === 'idle' && !forecast && (
              <div className={styles.emptyState}>
                <p>Введите название города для просмотра прогноза погоды</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ForecastPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Загрузка страницы..." />}>
      <ForecastPageContent />
    </Suspense>
  );
}
