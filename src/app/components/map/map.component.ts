import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Feature, MapboxService } from 'src/app/services/mapbox/mapbox.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  selectedLocationSubscription?: Subscription;
  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  constructor(private mapService: MapboxService) {}

  ngOnInit(): void {
    this.selectedLocationSubscription =
      this.mapService.selectedLocation.subscribe(
        (location: Feature | undefined) => {
          if (location) {
            this.map?.flyTo({
              center: location.center,
              essential: true,
            });
          }
        }
      );
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
      accessToken: environment.mapboxToken,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  }
  ngOnDestroy(): void {
    this.selectedLocationSubscription?.unsubscribe();
  }
}
