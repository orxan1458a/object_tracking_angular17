import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ShowAllZones {    
    public showAllPolygon: Subject<any> = new Subject();
}