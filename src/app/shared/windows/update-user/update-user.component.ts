import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceDB } from 'src/app/core/services/db/user_service_db.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompleteDialogBoxComponent } from 'src/app/core/complete-dialog-box/complete-dialog-box.component';
import { LiveRefrseshService } from 'src/app/core/services/subject/live_refresh_service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class UpdateUserComponent implements OnInit {
  durationInSeconds = 5;

  user_id: number = 0;
  user: any;
  cars: Array<any> = [];
  updateBoolean: boolean[] = [false, false];
  iList: Array<number> = [];
  userForm = this._formBuilder.group({
    userName: ['', [Validators.required, noWhitespaceValidator]],
    firstName: ['', [Validators.required, noWhitespaceValidator]],
    lastName: ['', [Validators.required, noWhitespaceValidator]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, noWhitespaceValidator]],
    password: [''],
    car_id: [''],
    id: ['', Validators.required]
  });

  constructor(
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private user_service_db: UserServiceDB,
    private dialog: MatDialog,
    private live_refresh_service: LiveRefrseshService,
    private _snackBar: MatSnackBar

  ) {
    this.user_id = data.user_id;
  }


  ngOnInit(): void {

    this.user_service_db.updateUser(this.user_id).subscribe((response) => {
      this.user = response;
      this.userForm.setValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        userName: this.user.userName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        password: null,
        car_id: '',
        id: this.user.id

      })
    });
  }

  changeIconClick(i: any) {
    this.updateBoolean[i] = !this.updateBoolean[i];
  }


  closeDialog() {
    this.dialogRef.close();
  }



  updateBtn() {
    if (this.userForm.valid) {
      this.user = {
        email: this.userForm.value.email,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        phoneNumber: this.userForm.value.phoneNumber,
        userName: this.userForm.value.userName,
        password: this.userForm.value.password,
        id: this.userForm.value.id,
      }

      this.user_service_db.updateUserSetting(this.user).subscribe((res) => {
        console.log(res)
        this.dialogRef.close();
        const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
          data: { title: "İstifadəçi məlumatları yeniləndi" },
          panelClass: 'complete-dialog-box'
        });
        dialogRef.disableClose = true;

        this.live_refresh_service.live_data_refresh.next(true)
      })
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
