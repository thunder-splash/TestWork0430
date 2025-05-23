import React from 'react';
import Image from 'next/image';
import { ForecastItem } from '@/types';
import styles from './ForecastCard.module.scss';

interface ForecastCardProps {
  forecastItem: ForecastItem;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastItem }) => {
  const date = new Date(forecastItem.dt * 1000);
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`card ${styles.forecastCard}`}>
      <div className="card-body">
        <h5 className="card-title">{time}</h5>
        
        <div className="d-flex align-items-center">
          <div className={styles.weatherIcon}>
            <Image 
              src={`https://openweathermap.org/img/wn/${forecastItem.weather[0]?.icon}@2x.png`}
              alt={forecastItem.weather[0]?.description || 'Погода'}
              width={50}
              height={50}
            />
          </div>
          <div>
            <h4 className={styles.temperature}>{Math.round(forecastItem.main.temp)}°C</h4>
            <p className={styles.description}>{forecastItem.weather[0]?.description}</p>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="mb-1">Ветер: {forecastItem.wind.speed} м/с</p>
          <p className="mb-1">Влажность: {forecastItem.main.humidity}%</p>
          {forecastItem.rain && <p className="mb-1">Осадки: {forecastItem.rain['3h']} мм</p>}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;