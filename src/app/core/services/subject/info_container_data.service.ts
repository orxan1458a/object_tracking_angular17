import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: 'root' }) 
export class InfoContainerDataService{
    public getData:Subject<any>=new Subject();
}