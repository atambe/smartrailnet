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
  private speedChart : AmChart;

  private values : any = [];
  url : string;
  constructor(private AmCharts: AmChartsService , private dataService:DataService) {}

  ngOnInit() {
     // Create chartdiv1
    // Create chartdiv2
    this.chart = this.AmCharts.makeChart('chartdiv', this.makeOptions());
    this.speedChart = this.AmCharts.makeChart('speedchartdiv', this.getSpeedChartOptions());
   // this.value = Math.round( Math.random() * 200 );
    //this.url = "http://localhost:8080/predictspeedt2";

    // Observable.interval(5000 ).subscribe(x => {
    //   this.dataService.getData(this.url).subscribe(data => {
    //     console.log(data);
    //     this.updateGraphs(data);
    //   }, error => {
    //     console.log(error);
    //   });
    // });
    //Get Data Once and then process it
    ////////////////////////////////////////////////////////////
      var url = "assets/data.json";
      this.dataService.getJSON(url).subscribe(data => {
        this.values=data;
        this.changeValue();
    }, error => {
      console.log(error);
    });
    ////////////////////////////////////////////////////////////
  }

  updateGraphs(data){
    //this.randomValue(this.chart, data.speed);
    this.speedChart.dataProvider.push({
        "time": new Date(),
        "speed": data.speed
    }
    );
    this.speedChart.validateData();
  }

  changeValue(){
    var i = 0;
    Observable.interval(1300 ).subscribe(x => {
      i = i + 1; 
      if(this.values){
        if(this.values[i]){
          if(this.values[i].speed){
            this.updateGraphs(this.values[i]);
            this.randomValue(this.chart,this.values[i].speed );
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
      "theme": "light",
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


  getSpeedChartOptions(){
    return {
       "hideCredits":true,
      "type": "serial",
      "theme": "light",
      "zoomOutButton": {
        "backgroundColor": '#000000',
        "backgroundAlpha": 0.15
      },
      "dataProvider": [],//this.generateChartData(),
      "categoryField": "time",
      "categoryAxis": {
        "parseDates": true,
        "minPeriod": "ss",
        "dashLength": 1,
        "gridAlpha": 0.15,
        "axisColor": "#DADADA"
      },
      "graphs": [ {
        "id": "g1",
        "type": "smoothedLine",
        "valueField": "speed",
        "bullet": "round",
        "bulletBorderColor": "#FFFFFF",
        "bulletBorderThickness": 2,
        "lineThickness": 2,
        "lineColor": "#b5030d",
        "negativeLineColor": "#0352b5",
        "hideBulletsCount": 50
      } ],
      "chartCursor": {
        "cursorPosition": "mouse"
      },
      "chartScrollbar": {
        "graph": "g1",
        "scrollbarHeight": 40,
        "color": "#FFFFFF",
        "autoGridCount": true
      }
    };
  }
}
