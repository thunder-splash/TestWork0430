import axios from 'axios';
import { CurrentWeather, WeatherData} from '@/types';

// API key for OpenWeatherMap
const API_KEY = '8fb7739fd3d31af74e500690cdc5f1c2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    params: {
      appid: '8fb7739fd3d31af74e500690cdc5f1c2',
      units: 'metric',
      lang: 'ru'
    }
  });

/**
 * Search for cities by name
 * @param query Search query
 * @returns Array of matching cities
 */
export const searchCities = async (query: string): Promise<Array<{
  id: string;
  name: string;
  country: string;
}>> => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    return response.data.map((city: {
      name: string;
      country: string;
      lat: number;
      lon: number;
    }) => ({
      id: `${city.lat}-${city.lon}`,
      name: city.name,
      country: city.country
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

/**
 * Get current weather for a city
 * @param city City name
 * @returns Weather data
 */
export const getWeather = async (city: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        units: 'metric',
        lang: 'ru',
        appid: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getCurrentWeather = async (city: string): Promise<CurrentWeather> => {
    try {
      const response = await weatherApi.get<CurrentWeather>('/weather', {
        params: { q: city }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Ошибка получения погоды: ${error.response.data.message || 'Неизвестная ошибка'}`);
      }
      throw new Error('Не удалось получить данные о погоде');
    }
  };

  export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      const response = await weatherApi.get('/weather', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении погоды по координатам:', error);
      throw error;
    }
  };

/**
 * Get 5-day forecast for a city
 * @param city City name
 * @returns Forecast data
 */
export const getForecast = async (city: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        units: 'metric',
        lang: 'ru',
        appid: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};