import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/db/data-service.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';
import { NotificationServiceDB } from 'src/app/core/services/db/notification_service_db.service';
import { StompService } from 'src/app/core/services/stomp.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isLoading = true;
  activeUser: { firstName: string, lastName: string } = { firstName: '', lastName: '' };
  opened_info_gps_id: number = 0;
  info_container_display: boolean = false;
  traject_info_container_display: boolean = false;


  constructor(
    private notification_service_db: NotificationServiceDB,
    public data_service: DataService,
    private layout_service: LayoutService,
    private stomp_service:StompService//dont delete
  ) { };

  ngOnInit(): void {


    this.notification_service_db.getAllNotificationSize().subscribe((res: any) => {
      this.data_service.allNotificationsSize = res;
    });

    this.data_service.getActiveUser().subscribe((res: any) => {
      this.activeUser = { firstName: res.firstName, lastName: res.lastName };
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });


    // soldaki navbarin yaninda acilmis layout-un olcusunu deyisir
    this.layout_service.router_size_change.subscribe((res) => {
      const container = document.getElementById('container') as HTMLElement;
      if (res == true) {
        container.classList.toggle('router-active')
      }
      else {
        container.classList.remove('router-active')
      }
    });
    // xəritənin aşağısında informasiya pəncərəsini vizuallaşdırır
    this.layout_service.info_container_display.subscribe((res: { visibility: boolean, component: string }) => {
      const container = document.getElementById('container') as HTMLElement;
      if (res.component == 'info-con') {
        if (res.visibility == true) {
          if (!this.info_container_display) {
            this.layout_service.info_container_display.next({visibility:false,component:'trajectory-info-con'});
            container.classList.toggle('info-container-active');
            this.info_container_display = true;
          }
        }
        else {
          container.classList.remove('info-container-active');
          this.info_container_display = false;
        }
      }
      else if (res.component == 'trajectory-info-con') {
        this.layout_service.info_container_display.next({visibility:false,component:'info-con'});
        if (res.visibility == true) {
          if (!this.traject_info_container_display) {
            container.classList.toggle('trajectory-info-container-active');
            this.traject_info_container_display = true;
          }
        }
        else {
          container.classList.remove('trajectory-info-container-active');
          this.traject_info_container_display = false;
        }
      }
    })
  }
}