import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompleteDialogBoxComponent } from 'src/app/core/complete-dialog-box/complete-dialog-box.component';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { ObjectServiceDB } from 'src/app/core/services/db/object_service_db.service';
import { UserServiceDB } from 'src/app/core/services/db/user_service_db.service';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-object.component.html',
  styleUrls: ['./update-object.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UpdateCarComponent implements OnInit {
  username: string = '';
  userList: any = [];
  objectTypes: Array<any[]> = [['0','Boş','Empty'],['1','Adam','Person'], ['2','Maşın','Car']];
  isAdmin = JSON.parse(localStorage.getItem('roles')!).findIndex((d: any) => d.roleName == 'Admin') != -1;

  objectForm = this._formBuilder.group({
    gpsId: ['', Validators.required],
    gpsSerialNumber: ['', Validators.required],
    objectName: [''],
    objectDetails: [''],
    objectType: ['', Validators.required],
    speedLimit:[0,Validators.required],
    userId: [0, Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { gpsId: number } = { gpsId: -1 },
    private dialogRef: MatDialogRef<UpdateCarComponent>,
    private user_service_db: UserServiceDB,
    public data_service: DataService,
    private dialog: MatDialog,
    private object_service_db: ObjectServiceDB,
    private _snackBar:MatSnackBar

  ) { }

  ngOnInit(): void {
    if(this.isAdmin){
      this.user_service_db.getUsernameList().subscribe((res) => {
        this.userList = res;
      });
    }
    this.object_service_db.getObject(this.data.gpsId).subscribe((res)=>{
      this.objectForm.setValue({
        gpsId:res.gpsId,
        gpsSerialNumber: res.gpsSerialNumber,
        objectName: res.objectName,
        objectDetails: res.objectDetails,
        objectType: res.objectType,
        speedLimit:res.speedLimit,
        userId: res.userId_and_username.userId})
    });

  }



  updateBtn() {

    if(this.objectForm.valid){

    const gpsId = this.objectForm.value.gpsId;

    var object={
      gpsId:this.objectForm.value.gpsId,
      gpsSerialNumber:this.objectForm.value.gpsSerialNumber,
      objectName: this.objectForm.value.objectName,
      objectDetails: this.objectForm.value.objectDetails,
      objectType: this.objectForm.value.objectType,
      speedLimit:this.objectForm.value.speedLimit,
      userId_and_username: {userId:this.objectForm.value.userId,username:""}

    }

    this.object_service_db.updateObject(object, gpsId).subscribe((res) => {

      const index = this.data_service.all_live_cars.findIndex((d:any)=>d.gpsId==gpsId);
      //@ts-ignore
      this.data_service.all_live_cars[index].objectType=this.objectForm.value.objectType;

      this.dialogRef.close();

      const dialogRef = this.dialog.open(CompleteDialogBoxComponent, {
        data: { title: "Obyekt məlumatları yeniləndi" },
        panelClass: 'complete-dialog-box',
        disableClose: true
      });
    });
  }
  else{
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 3 * 1000,
      data: {
        title: "check_cell_correctly"
      }
    });
  }

  }

  closeButton() {
    this.dialogRef.close();
  }

  dirtyCheck(controlName: string) {
    //@ts-ignore
    const control = this.objectForm.controls[controlName];

    const result = control.invalid && (control.dirty || control.touched);

    return result;
  }
}
