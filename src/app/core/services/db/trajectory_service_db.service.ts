import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TrajectoryServiceDB {

  url: string = environment.rest_api;

  constructor(
    private http: HttpClient,

  ) { }


  getTrajectoryz(gps_id: number, startDate: Date, endDate: Date) {
    const startDateMoment = moment(startDate);
    const endDateMoment = moment(endDate);
    console.log({ startDate: startDateMoment.toString(), endDate: endDateMoment.toString() })
    return this.http.post<any>(this.url + '/getCarTrajectories/' + gps_id, { startDate: startDateMoment.toString(), endDate: endDateMoment.toString() });
  }
  getTrajectory(gps_id: number,fromHour: Date,toHour:Date) {
    console.log({fromHour: fromHour.toString().split(" GMT")[0],toHour:toHour.toString().split(" GMT")[0] })
    return this.http.post<any>(this.url + '/getCarTrajectories/' + gps_id, { 
      fromHour: fromHour.toString().split(" GMT")[0],
      toHour:toHour.toString().split(" GMT")[0]});
  }


  simulateTrajectory() {
    return this.http.get<any>(this.url + '/simulateTrajectory');
  }

  originalTrajectory() {
    return this.http.get<any>(this.url + '/originalTrajectory');
  }
}