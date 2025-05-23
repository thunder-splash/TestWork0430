import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { ForecastData } from '@/types';
import styles from './TemperatureChart.module.scss';

interface TemperatureChartProps {
  forecast: ForecastData;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ forecast }) => {
  // Подготовка данных для графика
  const chartData = forecast.list.slice(0, 8).map(item => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(item.main.temp),
    };
  });

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Прогноз на 24 часа</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;