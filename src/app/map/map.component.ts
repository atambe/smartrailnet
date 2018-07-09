import { Component, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { Observable } from 'rxjs/Rx';


import { DataService } from '../data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  constructor(private dataService:DataService) {}

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  isTracking = false;

  currentLat: any;
  currentLong: any;

  marker: google.maps.Marker;
  marker1: google.maps.Marker;

  values : any = [];
  ngOnInit() {
    var markerArray = [];
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Pune.
    var map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 17,
      center: new google.maps.LatLng(18.5793, 73.8143)
    });
    // Create a renderer for directions and bind it to the map.
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
      icon : image
    });

    var image1 = {
      url: "assets/train-icon.png",
      size: new google.maps.Size(40, 45)
    };
  var mark1 = new google.maps.Marker({
    position: destination,
    map: map,
    title: 'Train Coordinates',
    icon : image1
  });

  this.calculateAndDisplayRoute(
    directionsDisplay, directionsService, markerArray, stepDisplay, map);

    this.dataService.getJSON().subscribe(data => {this.values=data;
    console.log(this.values[1]);
    this.movePrimaryTrain(map,mark);
    this.moveTrainAhead(map,mark1);
  }, error => {
    console.log(error);
  });
  }

  movePrimaryTrain(map,mark){
      var i = 0;
      Observable.interval(1000).subscribe(x => {
        i = i + 1;       
        var location = { lat: this.values[i].latitude, long: this.values[i].longitude };        
        //origin = new google.maps.LatLng(this.currentLat, this.currentLong)
        this.trackTrains(location, map , mark);       
      });
  }

  moveTrainAhead(map, mark1){
    var j = 10;
    Observable.interval(1000).subscribe(x => {
      j = j + 1;
    var location1 = { lat: this.values[j].latitude, long: this.values[j].longitude };
    this.trackTrains(location1, map , mark1);     
    }); 
  }


  trackTrains(trainloc, map , marker) {
    let location = new google.maps.LatLng(trainloc.lat, trainloc.long);
    map.panTo(location);
    var image = {
      url: "assets/train-icon.png",
      size: new google.maps.Size(100, 100)
    };
    marker.setPosition(location);
   
  }

calculateAndDisplayRoute(directionsDisplay, directionsService,
  markerArray, stepDisplay, map) {
// First, remove any existing markers from the map.
for (var i = 0; i < markerArray.length; i++) {
  markerArray[i].setMap(null);
}

// Retrieve the start and end locations and create a DirectionsRequest using
// WALKING directions.
directionsService.route({
  origin: "Pune",
  destination: "Lonavala",
  travelMode: 'TRANSIT',
  transitOptions: {
    departureTime: new Date(Date.now()),
    modes: ["TRAIN"]
  }
}, function(response, status) {
  // Route the directions and pass the response to a function to create
  // markers for each step.
  if (status === 'OK') {
    directionsDisplay.setDirections(response);
    //this.showSteps(response, markerArray, stepDisplay, map);
  } else {
    window.alert('Directions request failed due to ' + status);
  }
});
}

}
