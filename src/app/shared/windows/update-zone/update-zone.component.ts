import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MapPath } from 'src/app/core/services/subject/map_path.service';
import { UpdateZoneData } from 'src/app/core/services/subject/update_zone_data.service';
import { DatasourceCoordinates } from 'src/app/core/services/subject/datasource_coordinates.service';
import { ZoneService } from 'src/app/core/services/subject/zone.service';
import { ZoneServiceDB } from 'src/app/core/services/db/zone_service_db.service';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { CompleteDialogBoxComponent } from 'src/app/core/complete-dialog-box/complete-dialog-box.component';
import { DataService } from 'src/app/core/services/db/data-service.service';

@Component({
  selector: 'app-update-zone',
  templateUrl: './update-zone.component.html',
  styleUrls: ['./update-zone.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateZoneComponent implements OnInit {
  weekDay = new FormControl('');
  weekDaysList: string[] = ['I gün', 'II gün', 'III gün', 'IV gün', 'V gün', 'VI gün', 'VII gün'];
  displayedColumns: string[] = ['№', 'Coğrafi enlik', 'Coğrafi uzunluq', 'Sil'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  gps_id: number = 0;
  coordinat_list: any[] = [];
  zone: { id: number, allow: boolean, fromHour: string, toHour: string, weekDays: [], pointList: any }
    = { id: 0, allow: false, fromHour: '', toHour: '', weekDays: [], pointList: [] };

  zoneForm = this._formBuilder.group({
    id: ['', Validators.required],
    isAllow: [false, Validators.required],
    weekDays: [([] as number[]), Validators.required],
    fromHour: [new Date(), Validators.required],
    toHour: [new Date(), Validators.required],
  });
  durationInSeconds: number = 4;
  color: ThemePalette = 'accent';
  info_text_show = true;

  constructor(
    private map_path_service: MapPath,
    private update_zone_data_service: UpdateZoneData,
    private datasource_coordinates_service: DatasourceCoordinates,
    private zone_service: ZoneService,
    private zone_service_db: ZoneServiceDB,
    private _formBuilder: FormBuilder,
    public data_service: DataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.update_zone_data_service.updateZoneData.subscribe((res) => {
      this.zone_service_db.getZone(res.zone_id).subscribe((responseZone: any) => {
        this.zoneForm.setValue({ isAllow: responseZone.allow, fromHour: this.stringToSplit(responseZone.fromHour), id: responseZone.id, toHour: this.stringToSplit(responseZone.toHour), weekDays: responseZone.weekDays });
        this.dataSource.data = responseZone.pointList;
        this.map_path_service.mapPath.next({ coordinates: this.dataSource.data, allow: responseZone.allow });
      })
    });

    this.update_zone_data_service.createZoneData.subscribe((res: { gps_id: number }) => {
      this.gps_id = res.gps_id;
      this.dataSource.data = [];
      this.zoneForm.setValue({ isAllow: true, fromHour: this.stringToSplit('00:00:00'), id: '0', toHour: this.stringToSplit('23:59:59'), weekDays: [1,2,3,4,5,6,7] });

      this.map_path_service.mapPath.next({ coordinates: [], allow: true });

    });

    this.datasource_coordinates_service.datasourceCoordinates.subscribe((data) => {
      this.coordinat_list = [];
      for (var i = 0; i < data.length; i++) {
        this.coordinat_list.push({ id: data[i].id, latitude: data[i].lat, longitude: data[i].lng });
      }
      this.dataSource.data = this.coordinat_list;
    })
  }

  ngAfterViewInit() {
    const headerRow = document.querySelector('mat-header-row');
    const matTable = document.querySelector('mat-table');
    const tableContainer = document.querySelector('.example-container');
    if (tableContainer && headerRow && matTable) {
      tableContainer.insertBefore(headerRow, matTable);
    }
  }

  ngOnDestroy() {

  }

  changeRadioButton() {
    this.map_path_service.mapPath.next({ coordinates: this.dataSource.data, allow: this.zoneForm.value.isAllow }); // 
  }

  deleteColumn(id: any) {
    const index = this.dataSource.data.findIndex((d) => d.id == id);
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = [...this.dataSource.data];
    this.map_path_service.mapPath.next({ coordinates: this.dataSource.data, allow: this.zoneForm.value.isAllow }); //
  }


  updateBtn() {
    if (this.zoneForm.valid && this.dataSource.data.length != 0) {
      this.zone = {
        //@ts-ignore
        id: this.zoneForm.value.id,
        //@ts-ignore
        allow: this.zoneForm.value.isAllow,
        //@ts-ignore
        fromHour: this.timeFormatter(this.zoneForm.value.fromHour),
        //@ts-ignore
        toHour: this.timeFormatter(this.zoneForm.value.toHour),
        //@ts-ignore
        weekDays: this.zoneForm.value.weekDays,
        pointList: this.dataSource.data
      }
      this.zone_service_db.updateZone(this.zone).subscribe((res) => {
        this.data_service.update_icon_id = -1;
        console.log("Zone update successful");
        this.zone_service.update_zone.next(this.zone);
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "Zona yeniləndi" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;
      });


      this.map_path_service.mapPath.next({ coordinates: [], allow: true });
    }
    else {
      this.alertTextAnimation();
    }
  }

  createBtn() {
    if (this.zoneForm.valid && this.dataSource.data.length != 0) {
      this.zone = {
        //@ts-ignore
        id: this.zoneForm.value.id,
        //@ts-ignore
        allow: this.zoneForm.value.isAllow,
        //@ts-ignore
        fromHour: this.timeFormatter(this.zoneForm.value.fromHour),
        //@ts-ignore
        toHour: this.timeFormatter(this.zoneForm.value.toHour),
        //@ts-ignore
        weekDays: this.zoneForm.value.weekDays,
        pointList: this.dataSource.data
      }
// create common zone
      if(this.gps_id==0){
        this.zone_service_db.createCommonZone(this.zone).subscribe((res) => {
          this.data_service.update_icon_id = -1;
          console.log("Create common zone successful");
          this.zone_service.zones_refresh.next('empty');
          const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
            data: { title: "Yeni ümumi zona əlavə edildi" },
            panelClass: 'complete-dialog-box'
          });
          dialogRef.disableClose = true;
        })
      }
      else{
        this.zone_service_db.createZone(this.gps_id, this.zone).subscribe((res) => {
          this.data_service.update_icon_id = -1;
          console.log("Create zone successful");
          this.zone_service.zones_refresh.next('empty');
          const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
            data: { title: "Yeni zona əlavə edildi" },
            panelClass: 'complete-dialog-box'
          });
          dialogRef.disableClose = true;
        })
      }

      this.map_path_service.mapPath.next({ coordinates: [], allow: true });
    }
    else {
      this.alertTextAnimation();
    }
  }

  closeWindow() {
    this.map_path_service.mapPath.next({ coordinates: [], allow: true });
    this.data_service.update_icon_id = -1;
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

  timeFormatter(time: string) {
    if (time != undefined) {
      const date = new Date(time);
      const stringDate = this.twoDigitsConverter(date.getHours()) + ':' + this.twoDigitsConverter(date.getMinutes()) + ':' +'00'
      return stringDate;
    }
    else {
      return '';
    }
  }

  twoDigitsConverter(number: number) {
    if (number < 10) {
      return "0" + number
    }
    else {
      return number
    }

  }

  alertTextAnimation() {
    if (this.dataSource.data.length == 0) {
      var saygac = 0;
      var loop = setInterval(() => {
        saygac++
        if (saygac % 2 == 0) {
          this.info_text_show = false
        }
        else {
          this.info_text_show = true;
          if (saygac > 6) {
            clearInterval(loop)
          }
        }
      }, 200)
    }
  }
}

