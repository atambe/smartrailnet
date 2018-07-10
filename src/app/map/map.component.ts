import { Component, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { Observable } from 'rxjs/Rx';


import { DataService } from '../data.service';
import { ok } from 'assert';
import { and } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  constructor(private dataService: DataService) { }

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  isTracking = false;

  currentLat: any;
  currentLong: any;
  distance = { 'value': "123", 'text': "0.0 meters" };
  marker: google.maps.Marker;
  marker1: google.maps.Marker;

  values: any = [];
  secTrain : any = [];

  coocrdinates : any = [];
  ngOnInit() {
    this.findMe();
  }

  track: number;


  findMe() {
    var markerArray = [];
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Pune.
    var map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 16,
      center: new google.maps.LatLng(18.5793, 73.8143)
    });
    // Create a renderer for directions and bind it to the map.
    //this.map = map;
    
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow;

    this.currentLat = 18.528845;
    this.currentLong = 73.87177667;
    var origin = new google.maps.LatLng(this.currentLat, this.currentLong)
    var destination = new google.maps.LatLng(18.52884167, 73.86566167)

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



    // Code to load the data from JSON and display the path of the track
    var urlTrain1 = "assets/data.json";
    this.dataService.getJSON(urlTrain1).subscribe(data => {
      this.values = data;
      this.processSnapToRailRoadResponse(map);
      this.movePrimaryTrain(map, mark, mark1);
      //this.moveTrainAhead(map, mark1);
      //this.movePrimaryTrainAheadfromBackend(map, mark, mark1);
      //this.moveTrainAheadFromBackend(map, mark1);
    }, error => {
      console.log(error);
    });

    var urlTrain1 = "assets/train1.json";
    this.dataService.getJSON(urlTrain1).subscribe(data => {
      this.secTrain = data;
      this.processSnapToRailRoadResponse(map);
     // this.movePrimaryTrain(map, mark, mark1);
      this.moveTrainAhead(map, mark1);
      //this.movePrimaryTrainAheadfromBackend(map, mark, mark1);
      //this.moveTrainAheadFromBackend(map, mark1);
    }, error => {
      console.log(error);
    });
  }


  movePrimaryTrain(map, mark, mark1) {
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

    var isSameTrack = true;
    Observable.interval(1500).subscribe(x => {
      i = i + 1;
      var location = new google.maps.LatLng(this.values[i].latitude, this.values[i].longitude);
     if(this.track != this.values[i].trackId){
      isSameTrack = false;
     }else {
      isSameTrack = true;
     }
      //console.log(this.values[i].id);
      this.trackTrains(location, map, mark, true);
      this.calculateCirlceDistance(mark1.getPosition(), location, snappedCircle, this.distance , isSameTrack);
    });
  }

  moveTrainAhead(map, mark1) {
    var j = 0;
    Observable.interval(2250).subscribe(x => {
      j = j + 1;
      console.log(this.secTrain[j].id);
      var location1 = new google.maps.LatLng(this.secTrain[j].latitude, this.secTrain[j].longitude);
      this.track = this.secTrain[j].trackId;
      this.trackTrains(location1, map, mark1, false);
    });
  }

  movePrimaryTrainAheadfromBackend(map, mark, mark1) {
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
    Observable.interval(5000).subscribe(x => {

      var url = "http://localhost:8080/predictspeedt2";
      this.dataService.getData(url).subscribe(data => {
        console.log(data);
        var location = new google.maps.LatLng(data.latitude, data.longitude);
       // this.trackTrains(location, map, mark, true);
       // this.calculateCirlceDistance(mark1.getPosition(), location, snappedCircle, this.distance, true);
      }, error => {
        console.log(error);
      });
    });
  }

  moveTrainAheadFromBackend(map, mark1) {
    var url = "http://localhost:8080/predictspeedt1";
    this.dataService.getData(url).subscribe(data => {
      console.log(data);
      var location = new google.maps.LatLng(data.latitude, data.longitude);
      this.trackTrains(location, map, mark1, false);
      //this.calculateCirlceDistance(mark1.getPosition(), location, snappedCircle , this.distance); 
    }, error => {
      console.log(error);
    });
  }


  trackTrains(trainloc, map, marker, isprimary) {
    let location = trainloc;
    if (isprimary) {
      map.panTo(location);
    }
    var image = {
      url: "assets/train-icon.png",
      size: new google.maps.Size(100, 100)
    };
    marker.setPosition(location);

  }

  processSnapToRailRoadResponse(map) {
    var snappedCoordinates = [];
    for (var i = 0; i < this.values.length; i++) {
      var latlng = new google.maps.LatLng(
        this.values[i].latitude,
        this.values[i].longitude);
      snappedCoordinates.push(latlng);
    }

    var snappedPolyline = new google.maps.Polyline({
      path: snappedCoordinates,
      strokeColor: 'black',
      strokeWeight: 3
    });

    snappedPolyline.setMap(map);

  }


  calculateCirlceDistance(p1, p2, snappedCircle, distanceText, isSame) {
    var disMat = new google.maps.DistanceMatrixService();
    disMat.getDistanceMatrix(
      {
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
              if(!isSame){
                distanceText.text = "No Train on this track";
              }
              var color = 'green';
              if (distance < 500 && isSame) {
                color = 'red';
              }
              if (distance >= 500 && distance < 2000 && isSame) {
                color = 'orange';
              }
              if (distance > 2000 && isSame) {
                color = 'green';
              }
              //console.log(color);
              snappedCircle.setOptions({ fillColor: color })
              snappedCircle.setCenter(p2);

            }
          }
        }
      }
    )
  }

}
