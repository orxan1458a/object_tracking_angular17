import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserServiceDB } from '../services/db/user_service_db.service';
import { Inject } from '@angular/core';
import { EventServiceDB } from '../services/db/event_service_db.service';
import { CompleteDialogBoxComponent } from '../complete-dialog-box/complete-dialog-box.component';
import { ZoneServiceDB } from '../services/db/zone_service_db.service';
import { ZoneService } from '../services/subject/zone.service';
import { UserAuthService } from 'src/app/authentication/_services/user-auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ObjectServiceDB } from '../services/db/object_service_db.service';
import { ObjectService } from '../services/subject/object.service';

@Component({
  selector: 'app-delete-dialog-box',
  templateUrl: './delete-dialog-box.component.html',
  styleUrls: ['./delete-dialog-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteDialogBox implements OnInit {
  durationInSeconds: number = 3;
  title: string = '';
  left_button_text: string = '';
  right_button_text: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { deletedObject: String, id: any, number: String },
    private dialogRef: MatDialogRef<DeleteDialogBox>,
    private user_service_db: UserServiceDB,
    private event_service_db: EventServiceDB,
    private object_service_db: ObjectServiceDB,
    private zone_service_db: ZoneServiceDB,
    private zone_service: ZoneService,
    public dialog: MatDialog,
    private userAuthService: UserAuthService,
    private translate: TranslateService,
    private object_service: ObjectService


  ) { }

  ngOnInit(): void {
    if (this.data.deletedObject != "exit_user") {
      this.translate.get('Are_you_sure_want_delete').subscribe(x => this.title = x);
      this.translate.get('yes').subscribe(x => this.right_button_text = x);
      this.translate.get('no').subscribe(x => this.left_button_text = x);

    }
    else if (this.data.deletedObject == "exit_user") {
      this.translate.get('are_you_sure_want_logout').subscribe(x => this.title = x);
      this.translate.get('yes').subscribe(x => this.right_button_text = x);
      this.translate.get('no').subscribe(x => this.left_button_text = x);
    }

  }

  closeButton() {
    this.dialogRef.close();
  }

  confirmButton() {

    if (this.data.deletedObject == "user") {
      this.user_service_db.deleteUser(this.data.id).subscribe((res) => {
        this.dialogRef.close();
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "İstifadəçi sistemdən silindi" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;
      })
    }

    else if (this.data.deletedObject == "event_id_list") {
      this.event_service_db.deleteEvents(this.data.id).subscribe((res) => {
        this.dialogRef.close();
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "Hadisələr sistemdən silindi" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;
      })
    }

    else if (this.data.deletedObject == "object") {
      this.dialogRef.close();
      this.object_service_db.deleteGpsDeviceData(this.data.id).subscribe((res) => {
        this.object_service.objectCrud.next('empty')
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "Obyekt (" + this.data.number + ") sistemdən silindi" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;
      })
    }


    else if (this.data.deletedObject == "zone") {

      this.zone_service_db.deleteZone(this.data.id).toPromise().then((response) => {
        this.zone_service.delete_zone.next(this.data.id);

        this.dialogRef.close();
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "Zona sistemdən silindi" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;
      })
    }

    else if (this.data.deletedObject == "common_zone") {

      this.zone_service_db.deleteCommonZone(this.data.id).toPromise().then((response) => {
        this.zone_service.delete_zone.next(this.data.id);

        this.dialogRef.close();
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "deleted_common_zone" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;
      })
    }

    else if (this.data.deletedObject == "exit_user") {

      this.dialogRef.close();
      
      this.user_service_db.logout().subscribe((res) => {
        this.userAuthService.clear();
        window.location.reload();
      })

    }
  }

}
