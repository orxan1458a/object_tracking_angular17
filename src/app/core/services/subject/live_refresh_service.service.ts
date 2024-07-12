import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: 'root' }) 
export class LiveRefrseshService{
 live_data_refresh:Subject<any>=new Subject();
}