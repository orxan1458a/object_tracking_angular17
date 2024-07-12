import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { UserAuthService } from 'src/app/authentication/_services/user-auth.service';
import { CompleteDialogBoxComponent } from 'src/app/core/complete-dialog-box/complete-dialog-box.component';
import { UserServiceDB } from 'src/app/core/services/db/user_service_db.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {


  passwordForm = this._formBuilder.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]

  })

  constructor(
    private _formBuilder: FormBuilder,
    private user_service_db: UserServiceDB,
    private dialogRef: MatDialogRef<ResetPasswordComponent>,
    private dialog: MatDialog,
    private userAuthService: UserAuthService,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    let eyeicon = document.getElementById("eyeicon") as HTMLImageElement;
    let password = document.getElementById("password") as HTMLInputElement;

    const width = window.innerWidth;
    if (width < 800) {
      eyeicon.addEventListener("click", () => {
        if (password.type == "password") {
          password.type = "text";
          eyeicon.src = "../../../../assets/images/visibility.png";
        }
        else {
          password.type = "password";
          eyeicon.src = "../../../../assets/images/visible.png";
        }
      })
    }
    else {
      eyeicon.addEventListener("mousedown", () => {
        password.type = "text";
        eyeicon.src = "../../../../assets/images/visibility.png";
      })
      eyeicon.addEventListener("mouseup", () => {
        password.type = "password";
        eyeicon.src = "../../../../assets/images/visible.png";
      })
    }

  }

  clickButton() {
    const newPassword = this.passwordForm.value.newPassword;
    const confirmPassword = this.passwordForm.value.confirmPassword
    if (this.passwordForm.valid == true) {
      if (newPassword == confirmPassword) {

        this.user_service_db.resetPassword(this.passwordForm.value)
        .pipe(
          catchError(
            (err: HttpErrorResponse) => {
              console.log(err, err.error);
             
            
              return throwError("Current password is not match");
            }
          )
        )
          .subscribe((res: any) => {
            this.dialogRef.close();
            console.log(res)
            this.userAuthService.setToken(res.jwtToken);

            const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
              data: { title: "Şifrə yeniləndi" },
              panelClass: 'complete-dialog-box',
              disableClose: true
            });
          })
      }
      else {
        this._snackBar.openFromComponent(SnackBarComponent, {
          duration: 3 * 1000,
          data: {
            title: 'passwords_is_not_same',
          }
        });
      }
    }
    else {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 3 * 1000,
        data: {
          title: 'fill_cell',
        }
      });
    }
  }

  closeWindow() {
    this.dialogRef.close();
  }


}
