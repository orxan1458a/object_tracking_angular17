import { Component, Input, OnInit } from '@angular/core';
import { EventInfo } from 'src/app/core/models/EventInfo';

@Component({
  selector: 'app-event-info-container',
  templateUrl: './event-info-container.component.html',
  styleUrls: ['./event-info-container.component.scss']
})
export class EventInfoContainerComponent implements OnInit {
  @Input() 
  event_info:EventInfo=new EventInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
