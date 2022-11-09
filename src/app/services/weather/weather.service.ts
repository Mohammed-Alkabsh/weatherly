import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface WeatherResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly _locationWeather = new BehaviorSubject<any>(null);
  private readonly _locationWeatherLoading = new BehaviorSubject<boolean>(
    false
  );
  private readonly _locationWeatherLoadingError =
    new BehaviorSubject<HttpErrorResponse | null>(null);

  public readonly locationWeather = this._locationWeather.asObservable();
  public readonly locationWeatherLoading =
    this._locationWeatherLoading.asObservable();
  public readonly locationWeatherLoadingError =
    this._locationWeatherLoadingError.asObservable();

  constructor(private http: HttpClient) {}

  getWeather(long: number, lat: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}`;
    const options = {
      current_weather: true,
      temperature_unit: 'fahrenheit',
      windspeed_unit: 'mph',
      precipitation_unit: 'inch',
    };
    this._locationWeatherLoading.next(true);
    this._locationWeatherLoadingError.next(null);

    return this.http.get<WeatherResponse>(url, { params: options }).subscribe({
      next: (weather: WeatherResponse) => {
        this._locationWeatherLoading.next(false);
        this._locationWeatherLoadingError.next(null);
        this._locationWeather.next(weather);
        console.log(weather);
      },
      error: (error: HttpErrorResponse) => {
        this._locationWeatherLoading.next(false);
        this._locationWeatherLoadingError.next(error);
        console.log(error);
      },
    });
  }

  getWeatherCondition(weatherCode: number) {
    switch (weatherCode) {
      case 0:
        return 'Clear sky';

      case 1 | 2 | 3:
        return 'Mainly clear, partly cloudy, and overcast';
      case 45 | 48:
        return 'Fog and depositing rime fog';
      case 51 | 53 | 55:
        return 'Drizzle: Light, moderate, and dense intensity';
      case 56 | 57:
        return 'Freezing Drizzle: Light and dense intensity';
      case 61 | 63 | 65:
        return 'Rain: Slight, moderate and heavy intensity';
      case 66 | 67:
        return 'Freezing Rain: Light and heavy intensity';
      case 71 | 73 | 75:
        return 'Snow fall: Slight, moderate, and heavy intensity';
      case 77:
        return 'Snow grains';
      case 80 | 81 | 82:
        return 'Rain showers: Slight, moderate, and violent';
      case 85 | 86:
        return 'Snow showers slight and heavy';
      case 95:
        return 'Thunderstorm: Slight or moderate';
      case 96 | 99:
        return 'Thunderstorm with slight and heavy hail';

      default:
        return 'Uknown weather conditions';
    }
  }
}
