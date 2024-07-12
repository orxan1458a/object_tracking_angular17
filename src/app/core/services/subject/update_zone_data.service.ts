import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UpdateZoneData {    
    public updateZoneData: Subject<any> = new Subject();
    public createZoneData: Subject<any> = new Subject();
}