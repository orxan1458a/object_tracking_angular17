import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ZoneServiceDB {

  url: string = environment.rest_api;

  constructor(
    private http: HttpClient,
  ) { }

  getAllZones() {
    return this.http.get(this.url + '/objectsAndZones');
  }

  getZone(zone_id: number) {
    return this.http.get(this.url + '/getZone/' + zone_id);
  }

  updateZone(zone: any): Observable<any> {
    return this.http.post(this.url + '/updateZone/' + zone.id, zone);
  }

  createZone(gps_id: number, zone: any) {
    return this.http.post<any>(this.url + '/createZone/' + gps_id, zone);
  }

  createCommonZone(zone: any) {
    return this.http.post<any>(this.url + '/createCommonZone', zone);
  }

  showAllZones(gps_id: any): Observable<any> {
    return this.http.get<any>(this.url + '/showAllZones/' + gps_id);
  }

  deleteZone(zone_id: any): Observable<any> {
    return this.http.delete(this.url + '/deleteZone',{body:zone_id});
  }
  deleteCommonZone(zone_id: any): Observable<any> {
    return this.http.delete(this.url + '/deleteCommonZone', {body:zone_id});
  }
}