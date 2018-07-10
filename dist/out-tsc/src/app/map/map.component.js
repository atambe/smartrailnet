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
var Rx_1 = require("rxjs/Rx");
var data_service_1 = require("../data.service");
var MapComponent = /** @class */ (function () {
    function MapComponent(dataService) {
        this.dataService = dataService;
        this.isTracking = false;
        this.distance = { 'value': "123", 'text': "0.0 meters" };
        this.values = [];
    }
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        var markerArray = [];
        var directionsService = new google.maps.DirectionsService;
        // Create a map and center it on Pune.
        var map = new google.maps.Map(this.gmapElement.nativeElement, {
            zoom: 16,
            center: new google.maps.LatLng(18.5793, 73.8143)
        });
        // Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;
        this.currentLat = 18.528845;
        this.currentLong = 73.87177667;
        var origin = new google.maps.LatLng(this.currentLat, this.currentLong);
        var destination = new google.maps.LatLng(18.52884167, 73.86566167);
        var image = {
            url: "assets/train-icon.png",
            size: new google.maps.Size(40, 45)
        };
        var mark = new google.maps.Marker({
            position: origin,
            map: map,
            title: 'Train Coordinates',
            icon: image
        });
        var image1 = {
            url: "assets/train-icon.png",
            size: new google.maps.Size(40, 45)
        };
        var mark1 = new google.maps.Marker({
            position: destination,
            map: map,
            title: 'Train Coordinates',
            icon: image1,
            animation: google.maps.Animation.DROP
        });
        // this.calculateAndDisplayRoute(
        //   directionsDisplay, directionsService, markerArray, stepDisplay, map);
        // Code to load the data from JSON and display the path 
        this.dataService.getJSON().subscribe(function (data) {
            _this.values = data;
            _this.processSnapToRailRoadResponse(map);
            _this.movePrimaryTrain(map, mark, mark1);
            _this.moveTrainAhead(map, mark1);
            //this.drawDistance(mark, mark1,map);
            //this.drawCircle(mark1, mark, map);
        }, function (error) {
            console.log(error);
        });
    };
    MapComponent.prototype.movePrimaryTrain = function (map, mark, mark1) {
        var _this = this;
        var i = 0;
        var snappedCircle = new google.maps.Circle({
            strokeColor: 'black',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0.7,
            fillColor: 'yellow',
            map: map,
            radius: Math.sqrt(12000)
        });
        snappedCircle.bindTo('center', mark, 'position');
        Rx_1.Observable.interval(1000).subscribe(function (x) {
            i = i + 1;
            var location = new google.maps.LatLng(_this.values[i].latitude, _this.values[i].longitude);
            _this.trackTrains(location, map, mark, true);
            //this.calculateCirlceDistance(mark1.getPosition(), location, snappedCircle , this.distance); 
        });
    };
    MapComponent.prototype.moveTrainAhead = function (map, mark1) {
        var _this = this;
        var j = 10;
        Rx_1.Observable.interval(1000).subscribe(function (x) {
            j = j + 1;
            var location1 = new google.maps.LatLng(_this.values[j].latitude, _this.values[j].longitude);
            _this.trackTrains(location1, map, mark1, false);
        });
    };
    MapComponent.prototype.trackTrains = function (trainloc, map, marker, isprimary) {
        var location = trainloc;
        if (isprimary) {
            map.panTo(location);
        }
        var image = {
            url: "assets/train-icon.png",
            size: new google.maps.Size(100, 100)
        };
        marker.setPosition(location);
    };
    MapComponent.prototype.processSnapToRailRoadResponse = function (map) {
        var snappedCoordinates = [];
        for (var i = 0; i < this.values.length; i++) {
            var latlng = new google.maps.LatLng(this.values[i].latitude, this.values[i].longitude);
            snappedCoordinates.push(latlng);
        }
        var snappedPolyline = new google.maps.Polyline({
            path: snappedCoordinates,
            strokeColor: 'black',
            strokeWeight: 3
        });
        snappedPolyline.setMap(map);
    };
    MapComponent.prototype.calculateCirlceDistance = function (p1, p2, snappedCircle, distanceText) {
        var disMat = new google.maps.DistanceMatrixService();
        disMat.getDistanceMatrix({
            origins: [p1],
            destinations: [p2],
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                modes: [google.maps.TransitMode.TRAIN]
            }
        }, function (response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK) {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;
                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.value;
                        distanceText.text = element.distance.value + ' meters';
                        var color = 'green';
                        if (distance < 1500) {
                            color = 'red';
                        }
                        if (distance >= 1500 && distance < 2000) {
                            color = 'orange';
                        }
                        if (distance > 2000) {
                            color = 'green';
                        }
                        //console.log(color);
                        snappedCircle.setOptions({ fillColor: color });
                        snappedCircle.setCenter(p2);
                    }
                }
            }
        });
    };
    __decorate([
        core_1.ViewChild('gmap'),
        __metadata("design:type", Object)
    ], MapComponent.prototype, "gmapElement", void 0);
    MapComponent = __decorate([
        core_1.Component({
            selector: 'app-map',
            templateUrl: './map.component.html',
            styleUrls: ['./map.component.css']
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map