import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class VehicleService {
    public vehicle_set_center: Subject<any> = new Subject();
    public vehicle_set_center_by_latlon: Subject<number[]> = new Subject();

    public marker_focus: Subject<any> = new Subject();
}