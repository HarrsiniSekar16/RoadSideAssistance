import { Component, OnInit, AfterViewInit, Output, EventEmitter, AfterContentInit, Input, SimpleChanges } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';
import { google } from 'google-maps';
import { Observable, Subscriber, Subject } from 'rxjs';
import { Iuser } from 'src/app/interface/IResponse';
declare var google: any;

@Component({
  selector: 'app-find-vendor',
  templateUrl: './find-vendor.component.html',
  styleUrls: ['./find-vendor.component.scss']
})
export class FindVendorComponent {
  @Input()
  vinData : any;
  address: any;
  lat: string;
  long: string;
  vendorId : String;
  duration : string;
  icon: string = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4';
  constructor(private appService: AppServiceService) {
    let params = [];
    params.push("vendor")
    this.appService.get<Iuser>('US-UT',params).subscribe(x=>{
      this.coordinates = x.filter(y=> y.vendorLatitude != null && y.vendorLongitude != null);
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
        this.getCordinateDistance();
      });
    })
  }
  coordinates: Iuser[];
  coo : Iuser[]


  //get the distance between the user and vendor co-ordinates
  getCordinateDistance(){
    let subj = new Subject();
    this.coo = []
    subj.subscribe(
      (y:Iuser)=>{
      this.coo.push(y)
      debugger
      if(this.coo.length == this.coordinates.length ){
            this.coo.sort((a,b)=> (a.numDistance > b.numDistance) ? 1 : (b.numDistance > a.numDistance)? -1 : 0 );
            this.coo = this.coo.slice(0,1);
              this.coo.forEach(x => {
                this.vendorId = x.id;
                this.duration = x.duration
                this.emit();
              });
          }
      }
    );
    this.coordinates.forEach(x => {
      let origin = x.vendorLatitude + "," + x.vendorLongitude;
      let destination = this.lat + "," + this.long;
      this.getDistance(origin, destination).subscribe(y => {
        y.rows.filter(z => {
          z.elements.filter(k => { 
            x.distance = k.distance?.text;
            x.numDistance = k.distance?.text.replace(',','.').replace(/[^0-9\.]+/g,"");
            x.duration = k.duration?.text;
            subj.next(x);
             });
        });
      })
    });
   
  }
  @Output() switcher = new EventEmitter<any>();

  //show the current position with the latitude and longitude
  showPosition(position) {
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
    this.emit();
    this.appService.getExternal("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.lat + "," + this.long + "&key=AIzaSyCNH7ZuXjNdXqZFzlpOB0snpBZjoUC5jRo").subscribe(
      x => {
        x.results.slice(0, 1).forEach(y => this.address = y);
        this.address = this.address.formatted_address;
      }
    );
  }

  markerClicked(marker) {
    
  }

  //get the distance between the origin and detination
  getDistance(origin, destination): Observable<any> {
    let x = new Subject<any>();
    let service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      }, function callback(response, status) {
        x.next(response);
      });
    return x;
  }

  emit() {
    let loc = {
      "lat" : this.lat,
      "long" : this.long,
      "vendorId": this.vendorId,
      "duration" : this.duration
    }
    this.switcher.emit(loc);
  }

//co-ordinates for latitude and longitude
  getLatLong() {
    this.appService.getExternal("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.address + "&key=AIzaSyCNH7ZuXjNdXqZFzlpOB0snpBZjoUC5jRo").subscribe(
      x => {
        x.results.slice(0, 1).forEach(y => {
          this.lat = y.geometry.location.lat;
          this.long = y.geometry.location.lng;
          this.emit();
        });
        this.getCordinateDistance();
      }
    )
  }
}
