import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  ICountry,
  IState,
  LocationService,
} from 'src/app/services/location/location.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit, OnDestroy {
  authorizationTokenSubscription?: Subscription;
  authorizationTokenLoadingSubscription?: Subscription;
  authorizationTokenLoadingErrorSubscription?: Subscription;

  countriesSubscription?: Subscription;
  countriesLoadingSubscription?: Subscription;
  countriesLoadingErrorSubscription?: Subscription;

  statesSubscription?: Subscription;
  statesLoadingSubscription?: Subscription;
  statesLoadingErrorSubscription?: Subscription;

  citiesSubscription?: Subscription;
  citiesLoadingSubscription?: Subscription;
  citiesLoadingErrorSubscription?: Subscription;

  citiesAPIToken?: string;
  citiesAPITokenLoading: boolean = false;
  citiesAPITokenError: HttpErrorResponse | string | null = null;

  selectedCountry?: ICountry;
  selectedState?: IState;
  selectedCity: string = '';

  countries: ICountry[] = [];
  states: IState[] = [];
  cities: string[] = [];

  countriesLoading: boolean = false;
  statesLoading: boolean = false;
  citiesLoading: boolean = false;

  countriesError: HttpErrorResponse | string | null = null;
  statesError: HttpErrorResponse | string | null = null;
  citiesError: HttpErrorResponse | string | null = null;

  filteredCountries: ICountry[] = [];
  filteredStates: IState[] = [];
  filteredCities: string[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.getStateCityAuthToken();

    this.authorizationTokenSubscription =
      this.locationService.authorizationToken.subscribe(
        (token: string | undefined) => {
          this.citiesAPIToken = token;
        }
      );

    this.authorizationTokenLoadingSubscription =
      this.locationService.authorizationTokenLoading.subscribe(
        (isLoading: boolean) => {
          this.citiesAPITokenLoading = isLoading;
        }
      );

    this.authorizationTokenLoadingErrorSubscription =
      this.locationService.authorizationTokenLoadingError.subscribe(
        (error: HttpErrorResponse | string | null) => {
          this.citiesAPITokenError = error;
        }
      );

    this.countriesSubscription = this.locationService.countries.subscribe(
      (countries: ICountry[]) => {
        this.countries = countries;
        this.filteredCountries = countries;
      }
    );

    this.countriesLoadingSubscription =
      this.locationService.countriesLoading.subscribe((isLoading: boolean) => {
        this.countriesLoading = isLoading;
      });

    this.countriesLoadingErrorSubscription =
      this.locationService.countriesLoadingError.subscribe(
        (error: HttpErrorResponse | string | null) => {
          this.countriesError = error;
        }
      );

    this.statesSubscription = this.locationService.states.subscribe(
      (states: IState[]) => {
        this.states = states;
        console.log(this.states);
        this.filteredStates = states;
      }
    );

    this.statesLoadingSubscription =
      this.locationService.statesLoading.subscribe((isLoading: boolean) => {
        this.statesLoading = isLoading;
      });

    this.statesLoadingErrorSubscription =
      this.locationService.statesLoadingError.subscribe(
        (error: HttpErrorResponse | string | null) => {
          this.statesError = error;
        }
      );

    this.citiesSubscription = this.locationService.cities.subscribe(
      (cities: any) => {
        this.cities = cities;
      }
    );
    this.citiesLoadingSubscription =
      this.locationService.citiesLoading.subscribe((isLoading: boolean) => {
        this.citiesLoading = isLoading;
      });
    this.citiesLoadingErrorSubscription =
      this.locationService.citiesLoadingError.subscribe(
        (error: HttpErrorResponse | string | null) => {
          this.citiesError = error;
        }
      );
  }

  ngOnDestroy(): void {
    this.authorizationTokenSubscription?.unsubscribe();
    this.authorizationTokenLoadingSubscription?.unsubscribe();
    this.authorizationTokenLoadingErrorSubscription?.unsubscribe();

    this.countriesSubscription?.unsubscribe();
    this.countriesLoadingSubscription?.unsubscribe();
    this.countriesLoadingErrorSubscription?.unsubscribe();

    this.statesSubscription?.unsubscribe();
    this.statesLoadingSubscription?.unsubscribe();
    this.statesLoadingErrorSubscription?.unsubscribe();

    this.citiesSubscription?.unsubscribe();
    this.citiesLoadingSubscription?.unsubscribe();
    this.citiesLoadingErrorSubscription?.unsubscribe();
  }

  handleCountryFocus(event: any) {
    if (this.selectedCountry) {
      const country: string = event.target.value;
      this.locationService.fetchStates(country);
    } else {
      this.locationService.fetchCountries();
    }
  }

  filterCountry(event: any) {
    let filtered: ICountry[] = [];
    let query = event.query;
    for (let i = 0; i < this.countries.length; i++) {
      let country = this.countries[i];
      if (
        country.country_name.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  filterState(event: any) {
    let filtered: IState[] = [];
    let query = event.query;
    for (let i = 0; i < this.states.length; i++) {
      let state = this.states[i];
      if (state.state_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(state);
      }
    }

    this.filteredStates = filtered;
  }

  fetchCities(event: any) {
    const state = event.target.value;
    console.log(state);
    this.locationService.fetchCities(state);
  }

  searchCity(value: string) {
    console.log(value);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log(form.value);
  }
}
