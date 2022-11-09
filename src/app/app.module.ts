import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { LocationFormComponent } from './components/location-form/location-form.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [AppComponent, MapComponent, LocationFormComponent],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    FormsModule,
    ButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
