import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogBox } from 'src/app/core/delete-dialog-box/delete-dialog-box.component';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit {

  active_role: any;
  constructor(
    private layout_service: LayoutService,
    private dialog: MatDialog,
    private data_service: DataService
  ) {
  }

  ngOnInit(): void {
    this.active_role = this.data_service.isAdminRole();
  }

  logout() {
    const dialogRef = this.dialog.open(DeleteDialogBox, {
      data: { deletedObject: "exit_user", id: 0 },
      panelClass: 'custom-dialog-delete',
      disableClose: true
    });
  }

  routerModuleSize(isActive: boolean) {

    if (this.data_service.router_size_boolean == false && isActive) {
      this.data_service.router_size_boolean = true;
      this.layout_service.router_size_change.next(isActive);
    }
    else {
      this.data_service.router_size_boolean = false;
      this.layout_service.router_size_change.next(false);
    }
  }
}
