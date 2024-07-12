import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { ObjectServiceDB } from 'src/app/core/services/db/object_service_db.service';
import { TrajectoryServiceDB } from 'src/app/core/services/db/trajectory_service_db.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';
import { PathService } from 'src/app/core/services/subject/path.service';
import { VehicleService } from 'src/app/core/services/subject/vehicle_filter.service';


@Component({
  selector: 'app-trajectory',
  templateUrl: './trajectory.component.html',
  styleUrls: ['./trajectory.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TrajectoryComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion;

  dateTimeForm = this._formBuilder.group({
    date: [new Date(), Validators.required],
    fromHour: [new Date(), Validators.required],
    toHour: [new Date(), Validators.required],
  });

  fullNameDB: Array<{
    gpsId: number,
    gpsSerialNumber: string,
    notification: boolean,
    objectDetails: string
    objectName: string,
    objectType: number
  }> = [];
  fullNameModel: any[] = [];
  gps_id: number = -1;
  isLoadingShow: boolean = true;
  searchText: string = '';
  isTrajectoryLoading = false;
  selected_device_id: number = 0;

  constructor(
    private object_service_db: ObjectServiceDB,
    private trajectory_service_db: TrajectoryServiceDB,
    public data_service: DataService,
    private _formBuilder: FormBuilder,
    private vehicle_service: VehicleService,
    private layout_service: LayoutService,
    private path_service:PathService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.dateTimeForm.setValue({
        date: new Date(),
        fromHour: this.stringToSplit('00:00:00'),
        toHour: this.stringToSplit('23:59:59')
      });
    });

    this.object_service_db.getAllGpsData().subscribe((response) => {
      this.fullNameDB = response;
      this.fullNameModel = response
      this.isLoadingShow = false;

      if (this.fullNameDB.length > 0) {
        this.selected_device_id = this.fullNameDB[0].gpsId
      }

    });
  }

  cancel() {
    this.layout_service.info_container_display.next({ component: "trajectory-info-con", visibility: false });
    this.data_service.carTrackData = [];
    this.data_service.last_trajectory_point = {
      request_boolean: false,
      gps_id: 0,
      //@ts-ignore
      date: this.dateTimeForm.value.date,
      //@ts-ignore
      fromHour: this.dateTimeForm.value.fromHour,
      //@ts-ignore
      toHour: this.dateTimeForm.value.toHour
    }
  }
  ngOnDestroy() {
    this.data_service.carTrackData = [];
    this.layout_service.info_container_display.next({
      component: "trajectory-info-con",
      visibility: false
    });


    this.data_service.last_trajectory_point = {
      request_boolean: false,
      gps_id: 0,
      //@ts-ignore
      date: this.dateTimeForm.value.date,
      //@ts-ignore
      fromHour: this.dateTimeForm.value.fromHour,
      //@ts-ignore
      toHour: this.dateTimeForm.value.toHour
    }
  }

  refresh() {
    this.isLoadingShow = true;
    this.data_service.carTrackData = [];
    this.layout_service.info_container_display.next({ component: "trajectory-info-con", visibility: false });
    this.data_service.last_trajectory_point = {
      request_boolean: false,
      gps_id: 0,
      //@ts-ignore
      date: this.dateTimeForm.value.date,
      //@ts-ignore
      fromHour: this.dateTimeForm.value.fromHour,
      //@ts-ignore
      toHour: this.dateTimeForm.value.toHour
    }


    setTimeout(() => {
      this.dateTimeForm.setValue({
        date: new Date(),
        fromHour: this.stringToSplit('00:00:00'),
        toHour: this.stringToSplit('23:59:59')
      });
    });

    this.object_service_db.getAllGpsData().subscribe((response) => {
      this.fullNameDB = response;
      this.fullNameModel = response
      this.isLoadingShow = false;
    });
  }


  generateTodayDate(day: number) {
    const today = new Date();
    today.setDate(today.getDate() - day);
    today.setHours(24);
    today.setMinutes(0);
    today.setSeconds(0);
    return today;
  }

  searchInputEvent(text: string) {
    this.searchText = text;
    if (this.searchText.length != 0) {
      this.fullNameModel = this.fullNameDB.filter((d: any) => {
        if ((d.gpsSerialNumber + (d.objectName ? d.objectName : "") + (d.objectDetails ? d.objectDetails : "")).toLowerCase().includes(this.searchText.toLowerCase())) {
          return d
        }
      })
    }
    else {
      this.fullNameModel = this.fullNameDB;
    }
  }

  getTrajectory(gpsId: number) {
    this.cancel();
    console.log(this.dateTimeForm.value)
    this.dateTimeForm.value.fromHour?.setDate(this.dateTimeForm.value.date!.getDate());
    this.dateTimeForm.value.fromHour?.setMonth(this.dateTimeForm.value.date!.getMonth());
    this.dateTimeForm.value.fromHour?.setFullYear(this.dateTimeForm.value.date!.getFullYear());

    this.dateTimeForm.value.toHour?.setDate(this.dateTimeForm.value.date!.getDate());
    this.dateTimeForm.value.toHour?.setMonth(this.dateTimeForm.value.date!.getMonth());
    this.dateTimeForm.value.toHour?.setFullYear(this.dateTimeForm.value.date!.getFullYear());

    setTimeout(() => {
      this.gps_id = gpsId;
      this.isTrajectoryLoading = true;
      if (this.gps_id != -1) {
        //@ts-ignore
        this.trajectory_service_db.getTrajectory(this.gps_id, this.dateTimeForm.value.fromHour, this.dateTimeForm.value.toHour).subscribe((response: []) => {


          this.layout_service.info_container_display.next({ component: "trajectory-info-con", visibility: true });

          this.data_service.carTrackData = response;
          var path:google.maps.LatLngLiteral[]=[];
          response.map((point) => {
            path.push({
              lat: point[0],
              lng: point[1]
            })
          })
          this.path_service.path_data.next(path)
          console.log(this.data_service.trajectoryPath)
          console.log(new Date(), this.dateTimeForm.value.toHour)
          //@ts-ignore
          if (this.dateTimeForm.value.toHour > (new Date())) {
            this.data_service.focus_gps_id = gpsId;
            this.vehicle_service.vehicle_set_center.next(this.gps_id);
          };



          console.log(response);
          this.isTrajectoryLoading = false;

        });
      }

      setTimeout(() => {

        this.data_service.last_trajectory_point = {
          request_boolean: true,
          gps_id: gpsId,
          //@ts-ignore
          date: this.dateTimeForm.value.date,
          //@ts-ignore
          fromHour: this.dateTimeForm.value.fromHour,
          //@ts-ignore
          toHour: this.dateTimeForm.value.toHour
        }
      }, 1000);
    });
  }

  stringToSplit(time: any): any {
    if (time != undefined) {
      const t = new Date();
      const timeArray = time.split(":");
      t.setHours(timeArray[0]);
      t.setMinutes(timeArray[1]);
      t.setSeconds(timeArray[2]);

      return new Date(t);
    }
    else {
      return '';
    }
  }
}

