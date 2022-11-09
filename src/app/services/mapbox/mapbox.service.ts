import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
  type: string;
}

export interface Feature {
  place_name: string;
  center: [number, number];
}

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private readonly _selectedLocation = new BehaviorSubject<Feature | undefined>(
    undefined
  );

  private readonly _locations = new BehaviorSubject<Feature[]>([]);
  private readonly _locationsLoading = new BehaviorSubject<boolean>(false);
  private readonly _locationsLoadingError =
    new BehaviorSubject<HttpErrorResponse | null>(null);

  public readonly selectedLocation = this._selectedLocation.asObservable();

  public readonly locations = this._locations.asObservable();
  public readonly locationsLoading = this._locationsLoading.asObservable();
  public readonly locationsLoadingError =
    this._locationsLoadingError.asObservable();

  constructor(private http: HttpClient) {}

  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    this._locationsLoading.next(true);
    this._locationsLoadingError.next(null);
    return this.http
      .get<MapboxOutput>(
        url +
          query +
          '.json?types=address&access_token=' +
          environment.mapboxToken
      )
      .pipe(tap())
      .subscribe({
        next: (res: MapboxOutput) => {
          this._locationsLoading.next(false);
          this._locationsLoadingError.next(null);
          this._locations.next(res.features);
        },
        error: (error: HttpErrorResponse) => {
          this._locationsLoading.next(false);
          this._locationsLoadingError.next(error);
        },
      });
  }

  handleLocationSelect(location: Feature) {
    this._selectedLocation.next(location);
  }
}
