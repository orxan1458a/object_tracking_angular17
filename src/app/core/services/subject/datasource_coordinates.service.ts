import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DatasourceCoordinates {    
    public datasourceCoordinates: Subject<any> = new Subject();
}