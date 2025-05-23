import React from 'react';
import Link from 'next/link';
import { useWeatherStore } from '@/store/weatherStore';
import styles from './FavoritesList.module.scss';

const FavoritesList: React.FC = () => {
  const { favorites, removeFromFavorites } = useWeatherStore();
  
  if (favorites.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>У вас пока нет избранных городов</p>
        <p>Добавьте города в избранное, чтобы быстро получать информацию о погоде</p>
      </div>
    );
  }
  
  return (
    <div className={styles.favoritesList}>
      <h3 className={styles.title}>Избранные города</h3>
      <div className={styles.citiesContainer}>
        {favorites.map((city) => (
          <div key={city.id} className={styles.cityCard}>
            <div className={styles.cityInfo}>
              <Link href={`/?city=${city.name}`}>
                <h4>{city.name}, {city.country}</h4>
              </Link>
              
              {/* Remove references to city.weather since it doesn't exist in the type */}
              <div className={styles.weatherInfo}>
                <Link href={`/?city=${city.name}`} className={styles.viewButton}>
                  Посмотреть погоду
                </Link>
              </div>
            </div>
            
            <button 
              className={styles.removeButton}
              onClick={() => removeFromFavorites(city.id)}
              aria-label="Удалить из избранного"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;