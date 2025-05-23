import React from 'react';
import Image from 'next/image';
import { WeatherData } from '@/types';
import styles from './WeatherMiniCard.module.scss';

interface WeatherMiniCardProps {
  weather: WeatherData;
}

const WeatherMiniCard: React.FC<WeatherMiniCardProps> = ({ weather }) => {
  // Получаем текущую дату
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  });
  
  return (
    <div className={styles.miniCard}>
      <div className={styles.header}>
        <div className={styles.date}>{formattedDate}</div>
      </div>
      
      <div className={styles.iconContainer}>
        <Image 
          src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
          alt={weather.weather[0]?.description || 'Погода'}
          width={60}
          height={60}
        />
      </div>
      
      <div className={styles.temperature}>
        {Math.round(weather.main.temp)}°C
      </div>
      
      <div className={styles.description}>
        {weather.weather[0]?.description}
      </div>
    </div>
  );
};

export default WeatherMiniCard;