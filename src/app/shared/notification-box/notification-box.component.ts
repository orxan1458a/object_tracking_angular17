import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataService } from 'src/app/core/services/db/data-service.service';

@Component({
  selector: 'app-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss']
})
export class NotificationBoxComponent implements OnInit {
  
  //@ts-ignore
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(
    public data_service: DataService,
  ) { }

  ngOnInit(): void {
  }

  zzz(){
    console.log(this.data_service.allNotification)
  }
}
