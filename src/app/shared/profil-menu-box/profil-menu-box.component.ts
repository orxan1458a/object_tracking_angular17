import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';
import { ResetPasswordComponent } from '../windows/reset-password/reset-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profil-menu-box',
  templateUrl: './profil-menu-box.component.html',
  styleUrls: ['./profil-menu-box.component.scss']
})
export class ProfilMenuBoxComponent implements OnInit {

  @Input()
  user: { name: string, surName: string, username: string, tg_token: string } = { name: '', surName: '', username: '', tg_token: '' }


  constructor(
    private data_service:DataService,
    private _snackBar:MatSnackBar,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {

  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 3 * 1000,
      data: {
        title: 'copy_to_clipboard',
      }
    });
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      data: { deletedObject: "exit_user", id: 0 },
      panelClass: 'reset-password-dialog',
      disableClose: true
    });
  }

}
