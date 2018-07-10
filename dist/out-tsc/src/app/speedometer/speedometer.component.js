"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var amcharts3_angular_1 = require("@amcharts/amcharts3-angular");
var Rx_1 = require("rxjs/Rx");
var data_service_1 = require("../data.service");
var SpeedometerComponent = /** @class */ (function () {
    function SpeedometerComponent(AmCharts, dataService) {
        this.AmCharts = AmCharts;
        this.dataService = dataService;
        this.values = [];
    }
    SpeedometerComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Create chartdiv1
        // Create chartdiv2
        this.chart = this.AmCharts.makeChart('chartdiv', this.makeOptions());
        this.speedChart = this.AmCharts.makeChart('speedchartdiv', this.getSpeedChartOptions());
        this.value = Math.round(Math.random() * 200);
        Rx_1.Observable.interval(5000).subscribe(function (x) {
            _this.dataService.getData().subscribe(function (data) {
                console.log(data);
                _this.updateGraphs(data);
            }, function (error) {
                console.log(error);
            });
        });
        //Get Data Once and then process it
        ////////////////////////////////////////////////////////////
        // this.dataService.getJSON().subscribe(data => {this.values=data;
        //   this.changeValue();
        // }, error => {
        //   console.log(error);
        // });
        ////////////////////////////////////////////////////////////
    };
    SpeedometerComponent.prototype.updateGraphs = function (data) {
        this.randomValue(this.chart, data.speed);
        this.speedChart.dataProvider.push({
            "time": new Date(),
            "speed": data.speed
        });
        this.speedChart.validateData();
    };
    SpeedometerComponent.prototype.changeValue = function () {
        var _this = this;
        var i = 0;
        Rx_1.Observable.interval(2000).subscribe(function (x) {
            if (_this.values) {
                if (_this.values[i]) {
                    if (_this.values[i].speed) {
                        _this.updateGraphs(_this.values[i]);
                    }
                }
            }
        });
    };
    SpeedometerComponent.prototype.randomValue = function (gaugeChart, value) {
        //console.log("value called");
        if (gaugeChart) {
            if (gaugeChart.arrows) {
                if (gaugeChart.arrows[0]) {
                    if (gaugeChart.arrows[0].setValue) {
                        gaugeChart.arrows[0].setValue(value);
                        gaugeChart.axes[0].setBottomText(value + " km/h");
                    }
                }
            }
        }
    };
    SpeedometerComponent.prototype.makeOptions = function () {
        return {
            "hideCredits": true,
            "type": "gauge",
            "theme": "dark",
            "axes": [{
                    "axisThickness": 1,
                    "axisAlpha": 0.2,
                    "tickAlpha": 0.2,
                    "valueInterval": 20,
                    "bands": [{
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
                        }],
                    "bottomText": "0 km/h",
                    "bottomTextYOffset": -20,
                    "endValue": 220
                }],
            "arrows": [{ value: 40 }],
            "export": {
                "enabled": false
            }
        };
    };
    SpeedometerComponent.prototype.getSpeedChartOptions = function () {
        return {
            "hideCredits": true,
            "type": "serial",
            "theme": "light",
            "zoomOutButton": {
                "backgroundColor": '#000000',
                "backgroundAlpha": 0.15
            },
            "dataProvider": [],
            "categoryField": "time",
            "categoryAxis": {
                "parseDates": true,
                "minPeriod": "ss",
                "dashLength": 1,
                "gridAlpha": 0.15,
                "axisColor": "#DADADA"
            },
            "graphs": [{
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
                }],
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
    };
    SpeedometerComponent = __decorate([
        core_1.Component({
            selector: 'app-speedometer',
            templateUrl: './speedometer.component.html',
            styleUrls: ['./speedometer.component.css']
        }),
        __metadata("design:paramtypes", [amcharts3_angular_1.AmChartsService, data_service_1.DataService])
    ], SpeedometerComponent);
    return SpeedometerComponent;
}());
exports.SpeedometerComponent = SpeedometerComponent;
//# sourceMappingURL=speedometer.component.js.map