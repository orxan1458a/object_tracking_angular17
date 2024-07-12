import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceDB {


  url: string = environment.rest_api;

  constructor(
    private http: HttpClient,
  ) { }

  getAllNotification() {
    return this.http.get(this.url + '/getUserNotification');
  }

  getAllNotificationSize() {
    return this.http.get(this.url + '/getUserNotificationsSize');
  }

  deleteAllNotifications() {
    return this.http.delete(this.url + '/deleteAllNotifications');
  }


}

