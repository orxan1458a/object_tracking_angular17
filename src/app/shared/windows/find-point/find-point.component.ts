import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FindDataService } from 'src/app/core/services/subject/find.service';

@Component({
  selector: 'app-find-point',
  templateUrl: './find-point.component.html',
  styleUrls: ['./find-point.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class FindPointComponent implements OnInit {
  display: boolean = false;

  constructor(
    private find_service: FindDataService,
  ) { }

  ngOnInit(): void {
    this.find_service.find_point_display.subscribe((res)=>{
      this.display=!this.display;
    })
  }

  buttonClick() {
    var latitude = document.getElementById("latitude") as HTMLInputElement;
    var longitude = document.getElementById("longitude") as HTMLInputElement;
    if(latitude.value!='' && latitude.value !='')
    {
      this.display = false;
      this.find_service.search_data.next({ lat: latitude.value, lng: longitude.value, display: true })
    }
  }

  closeWindow() {
    this.display=false;
  }

}
