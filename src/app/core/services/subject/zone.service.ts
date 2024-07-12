import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ZoneService {    
    public zones_refresh: Subject<any> = new Subject();
    public delete_zone:Subject<any>=new Subject();
    public update_zone:Subject<any>=new Subject();
}