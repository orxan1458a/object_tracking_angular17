import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { UserServiceDB } from 'src/app/core/services/db/user_service_db.service';
import { AddUserComponent } from '../../shared/windows/add-user/add-user.component';
import { UpdateUserComponent } from '../../shared/windows/update-user/update-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  isSpinnerShow = false;
  usersDB: any[] = [];
  users_model: any[] = [];
  searchedUser: Array<any> = [];
  searchText = '';

  constructor(
    public dialog: MatDialog,
    private user_service_db: UserServiceDB,
  ) { }

  ngOnInit(): void {
    this.user_service_db.getAllUsers().subscribe((res: any) => {
      this.usersDB = res;
      this.users_model = res;
    })
  }

  refresh() {
    this.isSpinnerShow = true
    this.user_service_db.getAllUsers().subscribe((res: any) => {
      this.usersDB = res;
      this.users_model = res;
      this.isSpinnerShow = false;
    })
  }

  trackDataSource(index:number, item:any) {    
    return item.id; // unique id corresponding to the item
  }

  searchInputEvent(text: string) {
    this.searchText = text;
    if (this.searchText.length != 0) {
      this.users_model = this.usersDB.filter((d) => {
        if ((d.firstName.toLowerCase() + " " + d.lastName.toLowerCase()).includes(this.searchText.toLowerCase())) {
          return d
        }
      })
    }
    else {
      this.users_model = this.usersDB;
    }
  }


  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: 'custom-dialog-add-user',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.user_service_db.getAllUsers().subscribe((res: any) => {
        this.usersDB = res;
        this.users_model = res;
      })
    });
  }

  updateUserDialog(user_id: number) {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      panelClass: 'update-user-dialog',
      disableClose: true,
      data: {
        user_id: user_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.user_service_db.getAllUsers().subscribe((res: any) => {
        this.usersDB = res;
        this.users_model = res;

      })
    });
  }

  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string, user_id: number): void {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "user", id: user_id },
      enterAnimationDuration,
      exitAnimationDuration,
      panelClass: 'custom-dialog-delete',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.user_service_db.getAllUsers().subscribe((res: any) => {
        this.usersDB = res;
        this.users_model = res;
      })
    })
  }
}
