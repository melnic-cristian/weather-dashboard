export interface IWeather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: IDailyUnits;
  daily: IDaily;
}

export interface IDailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

export interface IDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface IWeatherChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}
