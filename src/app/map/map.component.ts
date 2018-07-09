import { Component, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  isTracking = false;

  currentLat: any;
  currentLong: any;

  marker: google.maps.Marker;
  marker1: google.maps.Marker;


  ngOnInit() {
    var markerArray = [];

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Manhattan.
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

  var mark1 = new google.maps.Marker({
    position: destination,
    map: map,
    title: 'Train Coordinates',
    icon : image
  });

    Observable.interval(1000).subscribe(x => {
    
      var location1 = { lat: this.currentLat, long: this.currentLong };
      this.trackTrains(location1, map , mark1);
      this.currentLat = (this.currentLat + 0.000020);
      this.currentLong = (this.currentLong + 0.00052);

      var location = { lat: this.currentLat, long: this.currentLong };
      origin = new google.maps.LatLng(this.currentLat, this.currentLong)
      this.trackTrains(location, map , mark);
     
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
}
