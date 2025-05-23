import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData, ForecastData, LoadingState } from '@/types';
import { getCurrentWeather, getForecast, getWeatherByCoords } from '@/services/weatherService';

// Define the FavoriteCity interface
export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  coord: {
    lat: number;
    lon: number;
  };
  weather?: {
    temp: number;
    description: string;
    icon: string;
  };
}

interface WeatherStore {
  // States
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  favorites: FavoriteCity[];
  favoritesWeather: Record<string, WeatherData | undefined>;
  favoritesLoading: Record<string, LoadingState>;
  searchCity: string;
  weatherLoading: LoadingState;
  forecastLoading: LoadingState;
  error: string | null;
  
  // Actions
  setSearchCity: (city: string) => void;
  fetchWeather: (city: string) => Promise<void>;
  fetchForecast: (city: string) => Promise<void>;
  addToFavorites: (city: FavoriteCity) => void;
  removeFromFavorites: (cityId: string | number) => void;
  fetchFavoriteWeather: () => Promise<void>;
  clearError: () => void;
}

// Create store with persistence for favorite cities
export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWeather: null,
      forecast: null,
      favorites: [],
      favoritesWeather: {},
      favoritesLoading: {},
      searchCity: '',
      weatherLoading: 'idle',
      forecastLoading: 'idle',
      error: null,
      
      // Set search city
      setSearchCity: (city) => set({ searchCity: city }),
      
      // Get current weather
      fetchWeather: async (city) => {
        try {
          set({ weatherLoading: 'loading', error: null });
          const weatherData = await getCurrentWeather(city);
          set({ currentWeather: weatherData, weatherLoading: 'success' });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error && 'response' in error && 
            typeof error.response === 'object' && error.response !== null &&
            'data' in error.response && typeof error.response.data === 'object' &&
            error.response.data !== null && 'message' in error.response.data
            ? String(error.response.data.message)
            : 'Ошибка при получении данных о погоде';
          set({ 
            weatherLoading: 'error', 
            error: errorMessage
          });
        }
      },
      
      // Get weather forecast
      fetchForecast: async (city) => {
        try {
          set({ forecastLoading: 'loading', error: null });
          const forecastData = await getForecast(city);
          set({ forecast: forecastData, forecastLoading: 'success' });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error && 'response' in error && 
            typeof error.response === 'object' && error.response !== null &&
            'data' in error.response && typeof error.response.data === 'object' &&
            error.response.data !== null && 'message' in error.response.data
            ? String(error.response.data.message)
            : 'Ошибка при получении прогноза погоды';
          set({ 
            forecastLoading: 'error', 
            error: errorMessage
          });
        }
      },
      
      // Add city to favorites
      addToFavorites: (city: FavoriteCity) => {
        set((state) => ({
          favorites: [...state.favorites, city]
        }));
      },
      
      // Remove city from favorites
      removeFromFavorites: (cityId: string | number) => {
        const id = typeof cityId === 'number' ? cityId.toString() : cityId;
        set((state) => ({
          favorites: state.favorites.filter(city => city.id !== id),
          favoritesWeather: {
            ...state.favoritesWeather,
            [id]: undefined
          },
          favoritesLoading: {
            ...state.favoritesLoading,
            [id]: 'idle'
          }
        }));
      },
      
      // Load weather for all favorite cities
      fetchFavoriteWeather: async () => {
        const { favorites } = get();
        
        for (const city of favorites) {
          // Set loading state
          set((state) => ({
            favoritesLoading: {
              ...state.favoritesLoading,
              [city.id]: 'loading'
            }
          }));
          
          try {
            const weatherData = await getWeatherByCoords(city.coord.lat, city.coord.lon);
            
            set((state) => ({
              favoritesWeather: {
                ...state.favoritesWeather,
                [city.id]: weatherData
              },
              favoritesLoading: {
                ...state.favoritesLoading,
                [city.id]: 'success'
              }
            }));
          } catch (error) {
            console.error('Ошибка при загрузке погоды для избранного города:', error);
            
            set((state) => ({
              favoritesLoading: {
                ...state.favoritesLoading,
                [city.id]: 'error'
              }
            }));
          }
        }
      },
      
      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);