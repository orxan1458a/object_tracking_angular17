import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ObjectServiceDB{

  url: string = environment.rest_api;

  constructor(
    private http: HttpClient,
  ) { }

  getAllGpsData() {
    return this.http.get<any>(this.url + '/gpsShortData');
  }

  getAllObjectsByUserId(user_id: any) {
    return this.http.get<any>(this.url + '/getAllObject/' + user_id);
  }
  
  deleteGpsDeviceData(gpsId: any) {
    return this.http.delete<any>(this.url + '/deleteGpsDeviceData/',{body:gpsId});
  }

  getObject(gpsId:number) {
    return this.http.get<any>(this.url + '/getObject/'+gpsId);
  }

  updateObject(object:any,gpsId:any) {
    return this.http.post<any>(this.url + '/updateObject/'+gpsId,object);
  }

  setNotification(gpsId:number){
    return this.http.get<any>(this.url + '/setNotification/'+gpsId);
  }

  getDeviceDataForInfo(gpsId:number){
    return this.http.get<any>(this.url + '/deviceDataForInfo/'+gpsId);
  }

  getDailyStatistics(gpsId:number){
    return this.http.get<any>(this.url + '/dailyStatistics/'+gpsId);

  }

  getDetailsData(gpsId:number){
    return this.http.get<any>(this.url + '/getLiveDataOnePart/'+gpsId);
  }


}