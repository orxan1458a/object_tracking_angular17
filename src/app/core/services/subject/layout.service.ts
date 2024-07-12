import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LayoutService {    
    public router_size_change: Subject<any> = new Subject();
    public info_container_display:Subject<any>=new Subject();
}