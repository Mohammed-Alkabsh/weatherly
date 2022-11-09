import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';

export interface ICountry {
  country_name: string;
  country_phone_code: number;
  country_short_name: string;
}

export interface IState {
  state_name: string;
}

export interface ICity {
  city_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly accessToken: string =
    '4uZ-xmlzhB7xTcOHgc8gN8Pe4VGSOehtKMB48QKuSTVUEj0Ybw5S43dwrk_F1xssRG8';
  private _authorizationToken = new BehaviorSubject<string | undefined>(
    undefined
  );
  private readonly _authorizationTokenLoading = new BehaviorSubject<boolean>(
    false
  );
  private readonly _authorizationTokenLoadingError = new BehaviorSubject<
    HttpErrorResponse | null | string
  >(null);

  private readonly _countries = new BehaviorSubject<ICountry[]>([]);
  private readonly _countriesLoading = new BehaviorSubject<boolean>(false);
  private readonly _countriesLoadingError = new BehaviorSubject<
    HttpErrorResponse | null | string
  >(null);

  private readonly _states = new BehaviorSubject<IState[]>([]);
  private readonly _statesLoading = new BehaviorSubject<boolean>(false);
  private readonly _statesLoadingError = new BehaviorSubject<
    HttpErrorResponse | null | string
  >(null);

  private readonly _cities = new BehaviorSubject<ICity[]>([]);
  private readonly _citiesLoading = new BehaviorSubject<boolean>(false);
  private readonly _citiesLoadingError = new BehaviorSubject<
    HttpErrorResponse | null | string
  >(null);

  public readonly authorizationToken = this._authorizationToken.asObservable();
  public authorizationTokenLoading =
    this._authorizationTokenLoading.asObservable();
  public authorizationTokenLoadingError =
    this._authorizationTokenLoadingError.asObservable();

  public readonly countries = this._countries.asObservable();
  public readonly countriesLoading = this._countriesLoading.asObservable();
  public readonly countriesLoadingError =
    this._countriesLoadingError.asObservable();

  public readonly states = this._states.asObservable();
  public readonly statesLoading = this._statesLoading.asObservable();
  public readonly statesLoadingError = this._statesLoadingError.asObservable();

  public readonly cities = this._cities.asObservable();
  public readonly citiesLoading = this._citiesLoading.asObservable();
  public readonly citiesLoadingError = this._citiesLoadingError.asObservable();

  constructor(private http: HttpClient) {}

  getStateCityAuthToken() {
    const url = 'https://www.universal-tutorial.com/api/getaccesstoken';
    const options = {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('api-token', this.accessToken)
        .set('user-email', 'mohammed.alkabsh@alight.com'),
    };
    this._authorizationTokenLoading.next(true);
    this._authorizationTokenLoadingError.next(null);
    return this.http.get(url, options as any).subscribe({
      next: (response: any) => {
        this._authorizationTokenLoading.next(false);
        this._authorizationTokenLoadingError.next(null);
        this._authorizationToken.next(`Bearer ${response.body.auth_token}`);
      },
      error: (error: HttpErrorResponse) => {
        this._authorizationTokenLoading.next(false);
        this._authorizationTokenLoadingError.next(error);
      },
    });
  }

  fetchCountries() {
    const authT: string | undefined = this._authorizationToken.getValue();
    if (authT) {
      const url = 'https://www.universal-tutorial.com/api/countries/';

      const options = {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Authorization', authT),
      };

      this._countriesLoading.next(true);
      this._countriesLoadingError.next(null);

      return this.http.get(url, options as any).subscribe({
        next: (response: any) => {
          const countries: ICountry[] = response.body;
          this._countriesLoading.next(false);
          this._countriesLoadingError.next(null);
          this._countries.next(countries);
        },
        error: (error: HttpErrorResponse) => {
          this._countriesLoading.next(false);
          this._countriesLoadingError.next(error);
        },
      });
    }
    return;
  }

  fetchStates(country: string) {
    const authT: string | undefined = this._authorizationToken.getValue();
    if (authT) {
      const url = `https://www.universal-tutorial.com/api/states/${country}`;
      const options = {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Authorization', authT),
      };

      this._statesLoading.next(true);
      this._statesLoadingError.next(null);

      return this.http.get<any>(url, options as any).subscribe({
        next: (response: any) => {
          const states: IState[] = response.body;
          this._states.next(states);
          this._statesLoading.next(false);
          this._statesLoadingError.next(null);
        },
        error: (error: HttpErrorResponse) => {
          this._statesLoading.next(false);
          this._statesLoadingError.next(error);
        },
      });
    }
    return;
  }

  fetchCities(state: string) {
    const authT: string | undefined = this._authorizationToken.getValue();
    if (authT) {
      const url = `https://www.universal-tutorial.com/api/cities/${state}`;

      const options = {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Authorization', authT),
      };

      this._citiesLoading.next(true);
      this._citiesLoadingError.next(null);

      return this.http.get(url, options as any).subscribe({
        next: (response: any) => {
          const cities = response.body;
          this._citiesLoading.next(false);
          this._citiesLoadingError.next(null);
          this._cities.next(cities);
        },
        error: (error: HttpErrorResponse) => {
          this._citiesLoading.next(false);
          this._citiesLoadingError.next(error);
        },
      });
    }
    return;
  }
}
