import { Component, OnInit, Input } from '@angular/core';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import {Observable} from 'rxjs/Rx';

import { DataService } from '../data.service';

@Component({
  selector: 'app-speedometer',
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.css']
})
export class SpeedometerComponent implements OnInit {

  public options: any;
  private chart: AmChart;
  private value: number;
  private values : any = [];
  
  constructor(private AmCharts: AmChartsService , private dataService:DataService) {}

  ngOnInit() {
     // Create chartdiv1
    // Create chartdiv2
    this.chart = this.AmCharts.makeChart('chartdiv', this.makeOptions());
    this.value = Math.round( Math.random() * 200 );
    this.dataService.getJSON().subscribe(data => {this.values=data;
      this.changeValue();
    }, error => {
      console.log(error);
    });
    
  }

  changeValue(){
    var i = 0;
    Observable.interval(2000 ).subscribe(x => {
      if(this.values){
        if(this.values[i]){
          if(this.values[i].speed){
            this.randomValue(this.chart, this.values[i].speed);
          }
        }
      }
    });
  }


  randomValue(gaugeChart, value) {
    //console.log("value called");
    if ( gaugeChart ) {
      if ( gaugeChart.arrows ) {
        if ( gaugeChart.arrows[ 0 ] ) {
          if ( gaugeChart.arrows[ 0 ].setValue ) {
      //      console.log("getting chart value")
            
        //    console.log("Value = " + value);
            gaugeChart.arrows[ 0 ].setValue(value );
            gaugeChart.axes[ 0 ].setBottomText( value + " km/h" );
          }
        }
      }
    }
  }
  
  makeOptions() {
    return {
      "hideCredits":true,
      "type": "gauge",
      "theme": "dark",
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 20,
        "bands": [ {
          "color": "#84b761",
          "endValue": 90,
          "startValue": 0
        }, {
          "color": "#fdd400",
          "endValue": 130,
          "startValue": 90
        }, {
          "color": "#cc4748",
          "endValue": 220,
          "innerRadius": "95%",
          "startValue": 130
        } ],
        "bottomText": "0 km/h",
        "bottomTextYOffset": -20,
        "endValue": 220
      } ],
      "arrows": [ {value : 40} ],
      "export": {
        "enabled": false
      }
    };
  }


}
