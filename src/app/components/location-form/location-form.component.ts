import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MapboxService, Feature } from 'src/app/services/mapbox/mapbox.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit, OnDestroy {
  locationsSubscription?: Subscription;
  locationsLoadingSubscription?: Subscription;
  locationsLoadingErrorSubscription?: Subscription;
  selectedLoactionSubscription?: Subscription;

  selectedLocation?: Feature;
  locations: Feature[] = [];
  locationsLoading: boolean = false;
  locationsLoadingError: HttpErrorResponse | null = null;

  constructor(
    private mapService: MapboxService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.locationsLoadingSubscription =
      this.mapService.locationsLoading.subscribe((isLoading: boolean) => {
        this.locationsLoading = isLoading;
      });

    this.locationsSubscription = this.mapService.locations.subscribe(
      (locations: Feature[]) => {
        this.locations = locations;
      }
    );

    this.locationsLoadingErrorSubscription =
      this.mapService.locationsLoadingError.subscribe(
        (error: HttpErrorResponse | null) => {
          this.locationsLoadingError = error;
        }
      );

    this.selectedLoactionSubscription =
      this.mapService.selectedLocation.subscribe(
        (location: Feature | undefined) => {
          this.selectedLocation = location;

          if (location) {
            this.weatherService.getWeather(
              location.center[0],
              location.center[1]
            );
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.locationsSubscription?.unsubscribe();
    this.locationsLoadingSubscription?.unsubscribe();
    this.locationsLoadingErrorSubscription?.unsubscribe();
    this.selectedLoactionSubscription?.unsubscribe();
  }

  searchPlace(event: any) {
    let query = event.query;
    this.mapService.search_word(query);
  }

  handleLocationSelect(value: Feature) {
    console.log(value);
    this.mapService.handleLocationSelect(value);
  }
}
