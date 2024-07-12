import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { ZoneServiceDB } from 'src/app/core/services/db/zone_service_db.service';
import { MapPath } from 'src/app/core/services/subject/map_path.service';
import { ShowAllZones } from 'src/app/core/services/subject/show_all_zones.service';
import { UpdateZoneData } from 'src/app/core/services/subject/update_zone_data.service';
import { ZoneService } from 'src/app/core/services/subject/zone.service';
import { DataService } from '../../core/services/db/data-service.service';


@Component({
  selector: 'app-locations',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZonesComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  object_zones_DB: any = [];
  object_zones_model: any = [];
  common_zones_db: any = []
  isLoadingShow = true;
  searchText: String = ''
  private subscriptions = new Subscription();
  add_zone_icon: String = "";
  isAdminRole: boolean = this.data_service.isAdminRole();
  refresh_icon: String = "../../../assets/images/refresh_icon.svg";


  constructor(
    public data_service: DataService,
    private update_zone_data_service: UpdateZoneData,
    private map_path_service: MapPath,
    private show_all_zones_service: ShowAllZones,
    private zone_service: ZoneService,
    private zone_service_db: ZoneServiceDB,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.zone_service_db.getAllZones().subscribe((res: any) => {
      this.object_zones_DB = res.objectAndZones;
      this.object_zones_model = res.objectAndZones;
      this.common_zones_db = res.commonZones
      this.isLoadingShow = false;
    });

    this.subscriptions.add(
      this.zone_service.zones_refresh.subscribe((res: any) => {
        this.zone_service_db.getAllZones().subscribe((response: any) => {
          this.object_zones_DB = response.objectAndZones;
          this.object_zones_model = response.objectAndZones;
          this.common_zones_db = response.commonZones;
          this.isLoadingShow = false;
        });
      })
    )

    this.subscriptions.add(
      this.zone_service.delete_zone.subscribe((zone_id) => {

        for (var i = 0; i < this.object_zones_DB.length; i++) {
          const index = this.object_zones_DB[i].zones.findIndex((d: any) => d.id == zone_id);

          if (index != -1) {
            this.object_zones_DB[i].zones.splice(index, 1);
            break;
          }
        }

        for (var i = 0; i < this.common_zones_db.length; i++) {
          const index = this.common_zones_db.findIndex((d: any) => d.id == zone_id);
          if (index != -1) {
            this.common_zones_db.splice(index, 1);
            break;
          }
        }
      })
    );



    this.subscriptions.add(
      this.zone_service.update_zone.subscribe((zone) => {
        console.log(this.object_zones_model)
        for (var i = 0; i < this.object_zones_model.length; i++) {
          const index = this.object_zones_model[i].zones.findIndex((d: any) => d.id == zone.id);
          if (index != -1) {
            this.object_zones_model[i].zones[index].toHour = zone.toHour;
            this.object_zones_model[i].zones[index].fromHour = zone.fromHour;
            this.object_zones_model[i].zones[index].allow = zone.allow;
            this.object_zones_model[i].zones[index].weekDays = zone.weekDays;
            break;
          }
          else {
            const index = this.common_zones_db.findIndex((d: any) => d.id == zone.id);
            if (index != -1) {
              this.common_zones_db[index].toHour = zone.toHour;
              this.common_zones_db[index].fromHour = zone.fromHour;
              this.common_zones_db[index].allow = zone.allow;
              this.common_zones_db[index].weekDays = zone.weekDays;
              break;
            }
          }
        }

      })
    );



  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  trackDataSource(index: number, item: any) {
    return item.id; // unique id corresponding to the item
  }
  
  searchInputEvent(text: string) {
    this.searchText = text;
    if (this.searchText.length != 0) {
      this.object_zones_model = this.object_zones_DB.filter((d: any) => {
        if ((d.gps_seria_number + d.object_name + d.object_details).toLowerCase().includes(this.searchText.toLowerCase())) {
          return d
        }
      })
    }
    else {
      this.object_zones_model = this.object_zones_DB;
    }
  }

  clickEyeIcon(zone_id: any): any {
    if (zone_id != this.data_service.eye_icon_id) {
      this.zone_service_db.getZone(zone_id).subscribe((response: any) => {
        this.map_path_service.mapPath.next({ coordinates: response.pointList, polygon_display: true, marker_display: false, allow: response.allow });
        this.data_service.eye_icon_id = zone_id;
        this.data_service.update_icon_id = -1;
      });
    }
    else {
      this.map_path_service.mapPath.next({ coordinates: [], polygon_display: false, marker_display: false, allow: false });
      this.data_service.eye_icon_id = -1;
    }
  }

  showAllZones(gps_id: any) {
    this.show_all_zones_service.showAllPolygon.next({ gpsId: gps_id });
  }

  updateZone(zone_id: any) {
    if (zone_id != this.data_service.update_icon_id) {
      this.data_service.update_icon_id = zone_id;
      this.data_service.eye_icon_id = -1;

      this.update_zone_data_service.updateZoneData.next({ zone_id: zone_id });
    }
    else {
      this.data_service.update_icon_id = -1;
    }
  }

  createZone(gps_id: any) {
    if (gps_id == 'commonZone') {
      this.data_service.update_icon_id = 2;
      this.update_zone_data_service.createZoneData.next({
        gps_id: 0,
      });
    }
    else {
      this.data_service.update_icon_id = 0;
      this.update_zone_data_service.createZoneData.next({
        gps_id: gps_id,
      });

    }
  }

  deleteZone(zone_id: any) {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "zone", id: zone_id },
      panelClass: 'custom-dialog-delete'
    });
    dialogRef.disableClose = true
  }

  deleteCommonZone(zone_id: any) {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "common_zone", id: zone_id },
      panelClass: 'custom-dialog-delete'
    });
    dialogRef.disableClose = true
  }

  refresh() {
    this.isLoadingShow = true;
    this.zone_service_db.getAllZones().subscribe((res: any) => {
      this.object_zones_DB = res.objectAndZones;
      this.object_zones_model = res.objectAndZones;
      this.common_zones_db = res.commonZones;
      this.isLoadingShow = false;
    });
  }
}
