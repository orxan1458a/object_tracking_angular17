import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { ObjectServiceDB } from 'src/app/core/services/db/object_service_db.service';
import { UserServiceDB } from 'src/app/core/services/db/user_service_db.service';
import { ObjectService } from 'src/app/core/services/subject/object.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';
import { UpdateCarComponent } from 'src/app/shared/windows/update-object/update-object.component';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObjectsComponent implements OnInit {

  isSpinnerShow = true;
  objectsDB: any[] = [];
  objects_model: any[] = [];
  add_car_icon = '../../../assets/images/add_car_icon_turqoise.svg';
  active_role: string = '';
  userId_and_username: Array<any> = [];
  selected_user_id: String = JSON.parse(localStorage.getItem('id')!);
  selected_username = '';
  searchText: string = '';
  isAdmin = JSON.parse(localStorage.getItem('roles')!).findIndex((d: any) => d.roleName == 'Admin') != -1;
  activeId = JSON.parse(localStorage.getItem('id')!);
  constructor(
    private object_service_db: ObjectServiceDB,
    private object_service: ObjectService,
    public dialog: MatDialog,
    private data_service: DataService,
    private user_service_db: UserServiceDB,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.active_role = this.data_service.getActiveRole()[0].roleName;
    if (this.isAdmin) {
      this.user_service_db.getUsernameList().subscribe((res: any) => {
        this.userId_and_username = res;
      })
    }

    this.object_service_db.getAllGpsData().subscribe((res) => {
      this.objectsDB = res;
      this.objects_model = res;
      this.isSpinnerShow = false;
    });

    this.object_service.objectCrud.subscribe((res) => {
      this.selectUser(false);
    })
  }

  refresh() {
    this.selectUser(true);
  }

  trackDataSource(index: number, item: any) {
    return item.id; // unique id corresponding to the item
  }

  updateObject(gpsId: number) {
    const dialogRef = this.dialog.open(UpdateCarComponent, {
      panelClass: 'custom-dialog-update-car',
      data: {
        gpsId: gpsId,
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectUser(false);
    });
  }

  openDeleteDialog(gpsId: number,gpsSerialNumber:string): void {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "object", id: gpsId ,number:gpsSerialNumber},
      panelClass: 'custom-dialog-delete',
      disableClose: true
    });
  }

  selectUser(showLoading:boolean) {
    const index = this.userId_and_username.findIndex((d) => (d.userId == this.selected_user_id));
    if (index != -1) {
      this.selected_username = this.userId_and_username[index].username
    }
    this.isSpinnerShow =showLoading? true:false;
    if (this.isAdmin) {
      this.object_service_db.getAllObjectsByUserId(this.selected_user_id).subscribe((response: any) => {
        this.objectsDB = response;
        this.objects_model = response;
        this.isSpinnerShow = false;
      })
    }
    else {
      this.object_service_db.getAllGpsData().subscribe((response: any) => {
        this.objectsDB = response;
        this.objects_model = response;
        this.isSpinnerShow = false;
      })
    }
  }

  setNotification(gpsId: number) {
    const index = this.objects_model.findIndex(d => (d.gpsId == gpsId));
    this.objects_model[index].notification = !this.objects_model[index].notification;
    this.object_service_db.setNotification(gpsId).subscribe((res) => {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 3 * 1000,
        data: {
          title: 'notification_' + res,
        }
      });

    })
  }

  searchInputEvent(text: string) {
    this.searchText = text;
    if (this.searchText.length != 0) {
      this.objects_model = this.objectsDB.filter((d: any) => {
        if ((d.gpsSerialNumber + " " + d.objectName + " " + d.objectDetails).toLowerCase().includes(this.searchText.toLowerCase())) {
          return d
        }
      })
    }
    else {
      this.objects_model = this.objectsDB;
    }
  }

}
