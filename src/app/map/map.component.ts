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
    icon : image1,
    animation:google.maps.Animation.DROP
  });

 
    // this.calculateAndDisplayRoute(
    //   directionsDisplay, directionsService, markerArray, stepDisplay, map);

      // Code to load the data from JSON and display the path 
    this.dataService.getJSON().subscribe(data => {this.values=data;
    this.processSnapToRailRoadResponse(map);
    this.movePrimaryTrain(map,mark);
    this.moveTrainAhead(map,mark1);
    this.drawCircle(mark, mark1, map);
    
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

  drawDistance(mark, mark1, map){  
    var snappedPolyline = new google.maps.Polyline({
            strokeWeight: 6
          }); 
    Observable.interval(1000).subscribe(x => {
      this.calculateDistance(mark.getPosition(),mark1.getPosition(), map ,snappedPolyline );   
    });
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
  
 


 calculateDistance(p1, p2, map, snappedPolyline) {
   var disMat = new google.maps.DistanceMatrixService();
   disMat.getDistanceMatrix(
     {
      origins : [p1],
      destinations :[ p2],
      travelMode : google.maps.TravelMode.TRANSIT,
      transitOptions : {
        modes : [google.maps.TransitMode.TRAIN]
      }
     },function(response,status){
      if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
    
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            var distance = element.distance.value;
            var color = 'green';
            if(distance < 1500){
              color = 'red';
            } 
            if(distance >= 1500 && distance < 2000){
              color = 'orange';
            } 
            if(distance > 2000){
              color = 'green';
            }
            console.log(color);
            snappedPolyline.setOptions({strokeColor : color})
            snappedPolyline.setPath([p1,p2]);
            snappedPolyline.setMap(map);   
          }
        }
      }
     }
   )        
}


drawCircle(mark, mark1, map){  
  var snappedCircle = new google.maps.Circle({
    strokeColor: 'black',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35,
    map: map,
    radius: Math.sqrt(12000)
  });
  
  Observable.interval(1000).subscribe(x => {
    this.calculateCirlceDistance(mark.getPosition(),mark1.getPosition(),snappedCircle );   
  });
}


calculateCirlceDistance(p1, p2, snappedCircle) {
  var disMat = new google.maps.DistanceMatrixService();
  disMat.getDistanceMatrix(
    {
     origins : [p1],
     destinations :[ p2],
     travelMode : google.maps.TravelMode.TRANSIT,
     transitOptions : {
       modes : [google.maps.TransitMode.TRAIN]
     }
    },function(response,status){
     if (status == google.maps.DistanceMatrixStatus.OK) {
       var origins = response.originAddresses;
       var destinations = response.destinationAddresses;
   
       for (var i = 0; i < origins.length; i++) {
         var results = response.rows[i].elements;
         for (var j = 0; j < results.length; j++) {
           var element = results[j];
           var distance = element.distance.value;
           var color = 'green';
           if(distance < 1500){
             color = 'red';
           } 
           if(distance >= 1500 && distance < 2000){
             color = 'orange';
           } 
           if(distance > 2000){
             color = 'green';
           }
           console.log(color);
           snappedCircle.setOptions({fillColor : color})
           snappedCircle.setCenter(p2);
         }
       }
     }
    }
  )        
}

}
