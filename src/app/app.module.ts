import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { AppComponent } from './app.component';
import {SpeedometerComponent} from './speedometer/speedometer.component';
import { MapComponent } from './map/map.component';

import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    SpeedometerComponent,
    MapComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AmChartsModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
