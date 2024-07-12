import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { CompleteDialogBoxComponent } from 'src/app/core/complete-dialog-box/complete-dialog-box.component';
import { UserServiceDB } from 'src/app/core/services/db/user_service_db.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {

  user: any;

  userForm = this._formBuilder.group({
    firstName: ['', [Validators.required, noWhitespaceValidator]],
    lastName: ['', [Validators.required, noWhitespaceValidator]],
    userName: ['', [Validators.required, noWhitespaceValidator]],
    password: ['', [Validators.required, noWhitespaceValidator]],
    email: ['', [Validators.required, Validators.email, noWhitespaceValidator]],
    phoneNumber: ['', [Validators.required, noWhitespaceValidator]]
  });



  constructor(
    private user_service_db: UserServiceDB,
    private addUserDialog: MatDialogRef<AddUserComponent>,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    setTimeout(() => {

    });
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

  closeWindow() {
    this.addUserDialog.close();
  }

  createButton() {
    if (this.userForm.valid) {
      this.user_service_db.addUser(this.userForm.value)
        .subscribe((res) => {

          this.addUserDialog.close();
          const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
            data: { title: "Yeni istifadəçi əlavə edildi" },
            panelClass: 'complete-dialog-box',
            disableClose: true
          });

        });
    }
    else {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 3 * 1000,
        data: {
          title: "check_cell_correctly"
        }
      });
    }
  }

  dirtyCheck(controlName: string) {
    //@ts-ignore
    const control = this.userForm.controls[controlName];

    const result = control.invalid && (control.dirty || control.touched);

    return result;
  }

}
export function noWhitespaceValidator(control: FormControl) {
  const isSpace = (control.value || '').match(/\s/g);
  return isSpace ? { 'whitespace': true } : null;
}
