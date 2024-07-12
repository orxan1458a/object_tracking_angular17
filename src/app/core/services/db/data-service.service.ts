import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LiveData } from '../../models/LiveData';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  show_all_object=true;
  is_center_object=false;
  show_live_trajectory=false;
  live_trajectory_points:Array<number[]>=[];

  focus_gps_id: number = 0;
  eye_icon_id: number = -1;
  head_eye_icon_id: number = -1;
  update_icon_id: number = -1;
  url = environment.rest_api;
  last_trajectory_point: { request_boolean: boolean, gps_id: number, date: Date,fromHour:Date,toHour:Date } = { request_boolean: false, gps_id: 0, date: new Date(),fromHour:new Date(),toHour:new Date()}
  all_live_cars:Array<LiveData>=[];
  carTrackData: Array<number[]>=[];
  trajectoryPath: google.maps.LatLngLiteral[]=[]
  allNotification: Array<any> = [];
  allNotificationsSize:number=0;
  router_size_boolean = false;
  animation_object:number[]=[0,0]


  constructor(
    private http: HttpClient,
  ) { 
     // Car icon live data
     this.getLiveCarData().subscribe((data: Array<LiveData>) => {
   this.all_live_cars=data
    });
  }

  public getLanguage() {
    return String(localStorage.getItem('language'));
  }

  getActiveUser() {
    return this.http.get(this.url + '/getUser');
  }

  getActiveRole(): [{ id: number, roleName: string, roleDescription: string }] {
    //@ts-ignore
    return JSON.parse(localStorage.getItem('roles')) as [{ id: number, roleName: string, roleDescription: string }];
  }

  isAdminRole(){
    //@ts-ignore
   var roles= JSON.parse(localStorage.getItem('roles')) as [{ id: number, roleName: string, roleDescription: string }];
   const index=roles.findIndex((d)=>d.roleName=='Admin');
   if(index!=-1){
    return true;
   }
   else{
    return false;
   }
  }

  getLiveCarData() {
    return this.http.get<any>(this.url + '/live');
  }


  
  
  numDeltas = 10;
  delay = 100; //milliseconds


  transition(index: number, newLat: number, newLng: number, oldLat: number, oldLng: number) {

    var deltaLat;
    var deltaLng;
    var i = 0;
    deltaLat = (newLat - oldLat) / this.numDeltas;
    deltaLng = (newLng - oldLng) / this.numDeltas;
    this.moveMarker(index, newLat, newLng, oldLat, oldLng, deltaLat, deltaLng, i);
  }

  moveMarker(index: number, newLat: number, newLng: number, oldLat: number, oldLng: number, deltaLat: number, deltaLng: number, i: number) {
    oldLat += deltaLat;
    oldLng += deltaLng;
    this.all_live_cars[index].point[0] = oldLat;
    this.all_live_cars[index].point[1] = oldLng;
    if (i != this.numDeltas) {
      i++;
      setTimeout(() => {
        this.moveMarker(index, newLat, newLng, oldLat, oldLng, deltaLat, deltaLng, i)
      }, this.delay);
    }
  }


}