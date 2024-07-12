import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: 'root' }) 
export class FindDataService{
    public find_point_display:Subject<any>=new Subject();
    public find_place_display:Subject<any>=new Subject();
    public search_data:Subject<any>=new Subject();
}