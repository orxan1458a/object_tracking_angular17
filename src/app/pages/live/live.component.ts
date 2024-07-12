import { ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from 'src/app/core/services/subject/vehicle_filter.service';
import { DataService } from '../../core/services/db/data-service.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { LayoutService } from 'src/app/core/services/subject/layout.service';
import { InfoContainerDataService } from 'src/app/core/services/subject/info_container_data.service';
import { ShowAllZones } from 'src/app/core/services/subject/show_all_zones.service';
import { LiveData } from 'src/app/core/models/LiveData';

@Component({
  selector: 'app-objects',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LiveComponent implements OnInit {
  isSpinnerShow = true;
  objectsDB: Array<LiveData> = [];
  objects_model: Array<LiveData> = [];
  searchText: string = '';

  constructor(
    private vehicle_service: VehicleService,
    public data_service: DataService,
    public dialog: MatDialog,
    private layout_service: LayoutService,
    private info_container_data_service: InfoContainerDataService,
    private show_all_zones_service: ShowAllZones,
  ) {

  }

  ngOnInit(): void {
    this.objectsDB = this.data_service.all_live_cars;
    this.objects_model = this.data_service.all_live_cars;
    this.isSpinnerShow = false;
  }

  refresh() {
    //@ts-ignore
    console.log(this.data_service.all_live_cars[0].sleep)
    this.isSpinnerShow = true;
    this.data_service.getLiveCarData().subscribe((data: Array<any>) => {
      this.data_service.all_live_cars.length = 0

      for (var object of data) {
        this.data_service.all_live_cars.push(object);
      }
      console.log(data)
      this.isSpinnerShow = false;
    });
  }

  objectFieldClick(gpsId: number) {
    this.vehicle_service.marker_focus.next({ gpsId: gpsId });
  }

  trackDataSource(index: number, item: any) {
    return item.id; // unique id corresponding to the item
  }
  @ViewChild(MatMenuTrigger)
  //@ts-ignore
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: "0px", y: "0px" };

  right_click_selected_gps_id: number = 0;
  onRightClick(event: any, gpsId: number): boolean {

    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.contextMenu.menu?.focusFirstItem("mouse");
    this.contextMenu.openMenu();
    this.right_click_selected_gps_id = gpsId;
    return false;
  }

  searchInputEvent(text: string) {
    this.searchText = text;
  }



  onContextMenuItemClick(clickField: string): void {
    if (clickField != 'zones') {
      this.data_service.focus_gps_id == this.right_click_selected_gps_id;
      this.vehicle_service.vehicle_set_center.next(this.right_click_selected_gps_id);
    }
    else if (clickField == 'zones') {
      this.show_all_zones_service.showAllPolygon.next({ gpsId: this.right_click_selected_gps_id });
      setTimeout(() => {
        this.data_service.focus_gps_id == this.right_click_selected_gps_id;
        this.vehicle_service.vehicle_set_center.next(this.right_click_selected_gps_id);
      }, 2000);

    }

    if (clickField == 'details') {
      this.vehicle_service.vehicle_set_center.next(this.right_click_selected_gps_id);
      this.layout_service.info_container_display.next({ component: "info-con", visibility: true });
      this.info_container_data_service.getData.next(this.right_click_selected_gps_id)
    }

  }
}