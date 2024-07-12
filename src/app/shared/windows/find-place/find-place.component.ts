// import { MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FindDataService } from 'src/app/core/services/subject/find.service';

@Component({
  selector: 'app-find-place',
  templateUrl: './find-place.component.html',
  styleUrls: ['./find-place.component.scss']
})
export class FindPlaceComponent implements OnInit {

  lat: number = 48;
  lng: number = 49;
  address: string = '';

  searchText = '';
  isSearchEnable = false;

  //@ts-ignore
  private geoCoder;

  //@ts-ignore
  @ViewChild('search') public searchElementRef: ElementRef;

  display: boolean = false;

  constructor(
    // private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private find_service: FindDataService,
  ) {
  }

  public ngOnInit(): void {
    this.find_service.find_place_display.subscribe((res) => {
      this.display = !this.display;
    });

    // this.mapsAPILoader.load().then(() => {
    //   this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;
    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       //get the place result
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       //verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       //set latitude, longitude and zoom
    //       this.lat = place.geometry.location.lat();
    //       this.lng = place.geometry.location.lng();
    //       this.isSearchEnable = true;
    //     });
    //   })
    // });
  }

  getAddress(latitude: number, longitude: number) {
    // this.geoCoder = new google.maps.Geocoder;
    // this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
    //   // console.log(results);
    //   // console.log(status);
    //   if (status === 'OK') {
    //     if (results[0]) {
    //       this.address = results[0].formatted_address;
    //     } else {
    //       window.alert('No results found');
    //     }
    //   } else {
    //     window.alert('Geocoder failed due to: ' + status);
    //   }
    // });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  searchBtnClick() {
    this.find_service.search_data.next({ lat: this.lat, lng: this.lng, display: true })
  }

  deleteClick() {
    var text_box = document.getElementById('search-place') as HTMLInputElement;
    text_box.value = "";
  }

  closeWindow() {
    this.display = false;
  }

  onPlaceChange() {
    this.isSearchEnable = false;
  }
}