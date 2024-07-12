import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventServiceDB{

  url: string = environment.rest_api;

  constructor(
    private http: HttpClient,
  ) { }


  getAllEvents(pageNumber:any) {
    return this.http.get(this.url + '/getAllEvents/page/'+pageNumber);
  }

  getAllEventsForExcel() {
    return this.http.get(this.url + '/getAllEventsForExcel');
  }

  getEvent(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/getEvent/' + id);
  }

  getDeviceEvents(gpsId: number): Observable<any> {
    return this.http.get<any>(this.url + '/deviceEvents/' + gpsId);
  }

  deleteEvent(id: number) {
    return this.http.get<any>(this.url + '/deleteEvent/' + id);
  }

  deleteEvents(event_id_list: number[]) {
    return this.http.delete<any>(this.url + '/deleteEvents',{body: event_id_list});
  }
  
  searchEventByTextAndTime(searchText:string,startDate:any,endDate:any,pageNumber:any){
    return this.http.post(this.url + '/searchEventByTextAndTime/page/'+pageNumber,{searchText:searchText,startDate:startDate,endDate:endDate});
  }
}