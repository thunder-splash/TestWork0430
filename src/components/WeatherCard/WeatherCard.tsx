import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WeatherData } from '@/types';
import { useWeatherStore } from '@/store/weatherStore';
import styles from './WeatherCard.module.scss';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const { addToFavorites, removeFromFavorites, favorites } = useWeatherStore();
  
  const isFavorite = favorites.some(city => city.id === weather.id.toString());
  
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(weather.id.toString());
    } else {
      addToFavorites({
        id: weather.id.toString(),
        name: weather.name,
        country: weather.sys.country,
        coord: weather.coord
      });
    }
  };
  
  // Получаем текущую дату
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  });
  
  return (
    <div className={`card ${styles.weatherCard}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h2 className="card-title">{weather.name}, {weather.sys.country}</h2>
            <p className={styles.dateInfo}>{formattedDate}</p>
          </div>
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
            onClick={handleFavoriteToggle}
            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#FFD700" : "none"} stroke={isFavorite ? "#FFD700" : "currentColor"} strokeWidth="2" className={styles.starIcon}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className={styles.favoriteTooltip}>
              {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            </span>
          </button>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <div className={styles.weatherIcon}>
            <Image 
              src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
              alt={weather.weather[0]?.description || 'Погода'}
              width={80}
              height={80}
            />
          </div>
          <div>
            <h3 className={styles.temperature}>{Math.round(weather.main.temp)}°C</h3>
            <p className={styles.description}>{weather.weather[0]?.description}</p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-6">
            <p>Ощущается как: {Math.round(weather.main.feels_like)}°C</p>
            <p>Влажность: {weather.main.humidity}%</p>
            <p>Видимость: {Math.round(weather.visibility / 1000)} км</p>
          </div>
          <div className="col-6">
            <p>Ветер: {weather.wind.speed} м/с</p>
            <p>Давление: {Math.round(weather.main.pressure * 0.75)} мм рт.ст.</p>
            <p>УФ-индекс: {weather.uvi || 'Н/Д'}</p>
          </div>
        </div>
        
        <div className="row mt-2">
          <div className="col-6">
            <p>Восход: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
          <div className="col-6">
            <p>Закат: {new Date(weather.sys.sunset * 1000).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <Link href={`/forecast?city=${weather.name}`} className="btn btn-primary w-100">
            Прогноз на 5 дней
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;