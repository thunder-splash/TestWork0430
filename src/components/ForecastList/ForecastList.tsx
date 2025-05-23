import React, { useState } from 'react';
import Image from 'next/image';
import { ForecastData } from '@/types';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import styles from './ForecastList.module.scss';

interface ForecastListProps {
  forecast: ForecastData;
}

const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Группировка прогноза по дням
  const groupedForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
    
    if (!acc[day]) {
      acc[day] = [];
    }
    
    acc[day].push(item);
    return acc;
  }, {} as Record<string, typeof forecast.list>);

  // Обработчик клика по карточке дня
  const handleDayClick = (day: string) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  // Подготовка данных для графика
  const getChartData = (items: typeof forecast.list) => {
    return items.map(item => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(item.main.temp),
      };
    });
  };

  return (
    <div className={styles.forecastContainer}>
      <h3 className={styles.title}>Прогноз на 5 дней</h3>
      
      <div className={styles.daysGrid}>
        {Object.entries(groupedForecast).map(([day, items]) => {
          // Находим среднюю температуру за день
          const avgTemp = items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
          
          // Берем погоду на середину дня или первую доступную
          const midDayItem = items.find(item => {
            const date = new Date(item.dt * 1000);
            return date.getHours() >= 12 && date.getHours() <= 15;
          }) || items[0];
          
          // Разделяем день недели и дату
          const [weekday, dateStr] = day.split(', ');
          
          return (
            <div key={day} className={styles.dayWrapper}>
              <div 
                className={`${styles.dayCard} ${expandedDay === day ? styles.expanded : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <div className={styles.dayHeader}>
                  <span className={styles.weekday}>{weekday.toUpperCase()}</span>
                  <span className={styles.date}>{dateStr}</span>
                </div>
                
                <div className={styles.weatherIcon}>
                  <Image 
                    src={`https://openweathermap.org/img/wn/${midDayItem.weather[0]?.icon}@2x.png`}
                    alt={midDayItem.weather[0]?.description || 'Погода'}
                    width={60}
                    height={60}
                  />
                </div>
                
                <div className={styles.temperature}>
                  {Math.round(avgTemp)}°C
                </div>
                
                <div className={styles.description}>
                  {midDayItem.weather[0]?.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {expandedDay && (
        <div className={styles.chartContainer}>
          <h4 className={styles.chartTitle}>
            Прогноз на {expandedDay}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={getChartData(groupedForecast[expandedDay])}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
              />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stroke="#4DA6FF" 
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ForecastList;