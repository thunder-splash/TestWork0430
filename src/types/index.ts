// Типы для данных о погоде
export interface WeatherData {
  id: number;
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
  visibility: number;
  uvi?: number;
}

// Add this type alias for CurrentWeather
export type CurrentWeather = WeatherData;

// Типы для прогноза погоды
export interface ForecastData {
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }>;
}

// Тип для избранного города
// Добавьте к существующим типам:

export interface City {
  id: string;
  name: string;
  country: string;
  coord?: {
    lat: number;
    lon: number;
  };
  weather?: {
    temp: number;
    description: string;
    icon: string;
  };
}

// Тип для состояния загрузки
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Add this interface to your types file
export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    // Add other properties as needed
  };
  weather: Array<{
    description?: string;
    icon?: string;
  }>;
  wind: {
    speed: number;
  };
  rain?: {
    '3h'?: number;
  };
}