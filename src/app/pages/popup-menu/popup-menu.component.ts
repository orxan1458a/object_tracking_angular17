import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupMenuComponent implements OnInit {
  isAdmin: boolean = false;
  user: { name: string, surName: string, username: string, tg_token: string } = { name: '', surName: '', username: '', tg_token: '' }
  language = String(localStorage.getItem('language'));

  constructor(
    private data_service: DataService,
    public dialog: MatDialog,
    private layout_service: LayoutService,
    public dialogRef:MatDialogRef<PopupMenuComponent>,
    private _snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.data_service.isAdminRole();

    this.data_service.getActiveUser().subscribe((res: any) => {
      this.user.name = res.firstName;
      this.user.surName = res.lastName;
      this.user.username = res.userName;
      this.user.tg_token = res.telegramToken
    });
  }

  visibleRoute() {

    this.data_service.router_size_boolean = false;
    this.layout_service.router_size_change.next(false);
    this.dialogRef.close();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 3 * 1000,
      data: {
        title: 'copy_to_clipboard',
      }
    });

  }

  logout() {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "exit_user", id: 0 },
      panelClass: 'custom-dialog-delete',
      disableClose: true
    });
  }
}
