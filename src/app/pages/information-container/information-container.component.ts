import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DailyStatistics } from 'src/app/core/models/DailyStatistics';
import { DetailsData } from 'src/app/core/models/DetailsData';
import { DeviceStaticData } from 'src/app/core/models/DeviceStaticData';
import { Event } from 'src/app/core/models/Event';
import { EventInfo } from 'src/app/core/models/EventInfo';
import { LiveData } from 'src/app/core/models/LiveData';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { EventServiceDB } from 'src/app/core/services/db/event_service_db.service';
import { ObjectServiceDB } from 'src/app/core/services/db/object_service_db.service';
import { FindDataService } from 'src/app/core/services/subject/find.service';
import { InfoContainerDataService } from 'src/app/core/services/subject/info_container_data.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';

@Component({
  selector: 'app-information-container',
  templateUrl: './information-container.component.html',
  styleUrls: ['./information-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InformationContainerComponent implements OnInit {
  gpsId: number = 0;
  recent_events: Event[] = [];
  static_data: DeviceStaticData = new DeviceStaticData;
  detailsData: DetailsData = new DetailsData;
  daily_statistics: DailyStatistics = new DailyStatistics;
  object: LiveData = new LiveData;
  //@ts-ignore
  shortObjectName = '';
  shortObjectDetails = '';
  address = '';
  interval: any;
  isRecentEventLoading = true;
  event_info: EventInfo = new EventInfo;

  constructor(
    public data_service: DataService,
    private event_service_db: EventServiceDB,
    private object_service_db: ObjectServiceDB,
    private info_container_data_service: InfoContainerDataService,
    private find_service: FindDataService,
    private layout_service: LayoutService
  ) { }

  ngOnInit(): void {

    this.info_container_data_service.getData.subscribe((gpsId: number) => {
      this.gpsId = gpsId;
      clearInterval(this.interval);

      var index = this.data_service.all_live_cars.findIndex((d: any) => d.gpsId == gpsId);
      this.object = this.data_service.all_live_cars[index];

      this.object_service_db.getDetailsData(gpsId).subscribe((response) => {
        this.detailsData = response;
      });

      this.getRecentEvent(gpsId);

      this.object_service_db.getDeviceDataForInfo(gpsId).subscribe((response: DeviceStaticData) => {
        this.static_data = response;
        console.log(response)
        this.shortObjectDetails = this.static_data.objectDetails && this.static_data.objectDetails.length > 16 ? this.static_data.objectDetails.slice(0, 15) + "..." : this.static_data.objectDetails;
        this.shortObjectName = this.static_data.objectName && this.static_data.objectName.length > 16 ? this.static_data.objectName.slice(0, 15) + "..." : this.static_data.objectName;

      });


      this.object_service_db.getDailyStatistics(gpsId).subscribe((response: DailyStatistics) => {
        console.log(response)
        this.daily_statistics = response;
        // this.daily_statistics.stopDuration = this.formatDuration(response.stopDuration);
        // this.daily_statistics.moveDuration = this.formatDuration(response.moveDuration);
      });


      this.interval = setInterval(() => {

        this.object_service_db.getDetailsData(gpsId).subscribe((response) => {
          this.detailsData = response;
        });
      }, 5000);

    })


    this.layout_service.info_container_display.subscribe((res: {visibility:boolean,component:string}) => {
      if (!res.visibility && res.component=='info-con') {
        clearInterval(this.interval)
      }
    });

  }


  eventInfo(event_id: number) {
    this.event_service_db.getEvent(event_id).subscribe((res) => {
      console.log(res)
      this.event_info = res;
      this.find_service.search_data.next({ lat: res.latitude, lng: res.longitude, zoom: 16, display: true });
    })
  }

  formatDuration(duration: string): string {
    const match: any = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    console.log(this.data_service.getLanguage())

    return this.data_service.getLanguage() == 'az' ? `${hours} s ${minutes} dq ${seconds} san` : `${hours} h ${minutes} min ${seconds} s`;
  }

  getRecentEvent(gpsId: number) {
    this.isRecentEventLoading = true;
    this.event_service_db.getDeviceEvents(gpsId).subscribe((res: Event[]) => {
      this.recent_events = res;
      console.log(res)
      this.isRecentEventLoading = false;
    });
  }
}
