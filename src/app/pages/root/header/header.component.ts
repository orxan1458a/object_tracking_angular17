import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { FindDataService, } from 'src/app/core/services/subject/find.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';
import { ResetPasswordComponent } from '../../../shared/windows/reset-password/reset-password.component';
import { NotificationServiceDB } from 'src/app/core/services/db/notification_service_db.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';
import { PopupMenuComponent } from '../../popup-menu/popup-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  user: { name: string, surName: string, username: string, tg_token: string } = { name: '', surName: '', username: '', tg_token: '' }

  language = String(localStorage.getItem('language'));
 

  constructor(
    private find_data_service: FindDataService,
    public data_service: DataService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private notification_service_db: NotificationServiceDB,
    private layout_service: LayoutService
  ) {
  }

  ngOnInit(): void {
    this.data_service.getActiveUser().subscribe((res: any) => {
      this.user.name = res.firstName;
      this.user.surName = res.lastName;
      this.user.username = res.userName;
      this.user.tg_token = res.telegramToken
    });
  }

  findPointDisplay() {
    this.find_data_service.find_point_display.next(true)
  }

  findAddressDisplay() {
    this.find_data_service.find_place_display.next(true);

  }

  logout() {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "exit_user", id: 0 },
      panelClass: 'custom-dialog-delete',
      disableClose: true
    });

  }

  notificationListDelete() {
    this.notification_service_db.getAllNotification().subscribe((res: any) => {
      this.data_service.allNotification = res;
    });
    setTimeout(() => {
      this.notification_service_db.deleteAllNotifications().subscribe((res) => {
        this.data_service.allNotificationsSize = 0;
      });
    }, 5000);
  }

  clickDropdown() {

    const dialogRef = this.dialog.open(PopupMenuComponent, {
      panelClass: 'custom-dialog-popup-menu'
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   this.selectUser();
    // });
  }

}


