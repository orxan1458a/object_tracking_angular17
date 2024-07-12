import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { EventServiceDB } from 'src/app/core/services/db/event_service_db.service';
import { FindDataService } from 'src/app/core/services/subject/find.service';
import { ExcelService } from '../../core/services/excel.service';
import { EventInfo } from 'src/app/core/models/EventInfo';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['currentDateTime', 'firstName', 'event', 'delete'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isSpinnerShow = false;
  isTableSpinner = false;
  deleted_event_id_list: Array<number> = [];
  event_info: EventInfo=new EventInfo;
  pageNumber: number = 1;
  totalPages: number = 0;
  allEventCount = 0;
  searchText: string = '';
  startDate: any = this.generateTodayDate(1);
  endDate: any = this.generateTodayDate(0);
  startTimeActive: boolean = false;
  endTimeActive: boolean = false;

  //@ts-ignore
  @ViewChild('TABLE') table: ElementRef;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    private event_service_db: EventServiceDB,
    public dialog: MatDialog,
    private excel_service: ExcelService,
    private find_service: FindDataService
  ) {

  }


  ngOnInit(): void {
    this.isSpinnerShow = true;
    this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
      this.dataSource.data = res[0];
      this.totalPages = res[1];
      this.allEventCount = res[2];
      this.isSpinnerShow = false;
    });
  }

  refresh() {
    this.isTableSpinner = false;
    this.isSpinnerShow = true
    this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
      this.dataSource.data = res[0];
      this.totalPages = res[1]
      this.isSpinnerShow = false;
      this.allEventCount = res[2];
      this.startTimeActive = false;
      this.endTimeActive = false;
      this.startDate = this.generateTodayDate(1);
      this.endDate = this.generateTodayDate(0);


    })
  }

  exportExcel() {
    const fileData: Array<{ 
      Id: number, 
      İmei_nömrə: string, 
      Hadisə: string, 
      Coğrafi_enlik: number, 
      Coğrafi_uzunluq: number, 
      Ünvan: any, 
      Hündürlük: String, 
      Azimut: number, 
      Sürət: string, 
      Vaxt_və_tarix: string,
      Peyk_sayı:number,
      Signal_səviyyəsi:number,
      Batareya_səviyyəsi:number
    }> = [];
    this.event_service_db.getAllEventsForExcel().subscribe((res: any) => {
      for (var i = 0; i < res.length; i++) {
        fileData.push({
          Id: res[i].id,
          İmei_nömrə: res[i].gpsSerialNumber,
          Hadisə: res[i].event,
          Coğrafi_enlik: res[i].latitude,
          Coğrafi_uzunluq: res[i].longitude,
          Ünvan: res[i].address,
          Hündürlük: res[i].altitude,
          Azimut: res[i].heading,
          Sürət: res[i].speed,
          Vaxt_və_tarix: res[i].currentDateTime,
          Peyk_sayı:res[i].satelliteCount,
          Signal_səviyyəsi:res[i].gsmSignalLvl,
          Batareya_səviyyəsi:res[i].batteryLvl

        })
      }
      this.excel_service.exportAsExcelFile(fileData.sort((n1: any, n2: any) => n2.id - n1.id), 'hadiseler');
    })

  }



  headRemove() {
    if (this.deleted_event_id_list.length == this.dataSource.data.length) {
      this.deleted_event_id_list = [];
    }
    else {
      for (var data of this.dataSource.data) {
        if (!this.deleted_event_id_list.includes(data.event_id)) {
          this.deleted_event_id_list.push(data.event_id)
        }
      }
    }
  }

  deleteEvent() {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "event_id_list", id: this.deleted_event_id_list },
      panelClass: 'custom-dialog-delete',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
        this.dataSource.data = res[0];
        this.totalPages = res[1];
        this.allEventCount = res[2];
        this.deleted_event_id_list = [];
      });
    });
  }

  deleteToggleButton(event: any, event_id: number) {
    if (event.checked && !this.deleted_event_id_list.includes(event_id)) {
      this.deleted_event_id_list.push(event_id);
    }
    else if (!event.checked && this.deleted_event_id_list.includes(event_id)) {
      const index = this.deleted_event_id_list.indexOf(event_id);
      this.deleted_event_id_list.splice(index, 1);
    }

  }

  eventInfo(event_id: number) {
    this.event_service_db.getEvent(event_id).subscribe((res) => {
      this.event_info = res;
      this.find_service.search_data.next({ lat: res.latitude, lng: res.longitude, zoom: 16, display: true });
    })
  }

  closeMenu(menu: any) {
    menu.closeMenu();
  }

  previousPage() {
    if (this.pageNumber > 1) {

      this.pageNumber = this.pageNumber - 1;
      this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
        this.dataSource.data = res[0];
        this.totalPages = res[1]
      });
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber = this.pageNumber + 1;
      this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
        this.dataSource.data = res[0];
        this.totalPages = res[1]
      });
    }
  }

  changeStartDate($event: any) {
    this.isTableSpinner = true;
    this.startDate = $event.value._d;
    this.startTimeActive = true;

    var startdate = this.startDate;
    var endDate = this.endDate;

    if (this.endTimeActive != true) {
      endDate = null;
    }
    this.event_service_db.searchEventByTextAndTime(this.searchText, startdate, endDate, 1).subscribe((res: any) => {
      this.dataSource.data = res;
      this.allEventCount = res.length;
      this.isTableSpinner = false
    });
  }

  changeEndDate($event: any) {
    this.isTableSpinner = true;
    this.endDate = $event.value._d;
    this.endTimeActive = true;

    var startdate = this.startDate;
    var endDate = this.endDate;
    if (this.startTimeActive != true) {
      startdate = null;
    }
    this.event_service_db.searchEventByTextAndTime(this.searchText, startdate, endDate, 1).subscribe((res: any) => {
      console.log(res)
      this.dataSource.data = res;
      this.allEventCount = res.length;
      this.isTableSpinner = false;
    });
  }

  closeSearch() {
    this.startTimeActive = false;
    this.endTimeActive = false;
    this.searchText = '';

    this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
      this.dataSource.data = res[0];
      this.totalPages = res[1];
      this.allEventCount = res[2];
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
    var startDate = this.startDate;
    var endDate = this.endDate;
    if (this.startTimeActive != true) {
      startDate = null
    }
    if (this.endTimeActive != true) {
      endDate = null;
    }
    if (this.endTimeActive == false && this.endTimeActive == false && this.searchText.length == 0) {
      this.isSpinnerShow = true;
      this.event_service_db.getAllEvents(this.pageNumber).subscribe((res: any) => {
        this.dataSource.data = res[0];
        this.totalPages = res[1];
        this.allEventCount = res[2];
        this.isSpinnerShow = false;
      });
    }
    else {
      this.isTableSpinner = true;
      this.event_service_db.searchEventByTextAndTime(this.searchText, startDate, endDate, 1).subscribe((res: any) => {
        this.dataSource.data = res;
        this.allEventCount = res.length;
        this.isTableSpinner = false;
      });
    }
  }

}