import { Injectable } from "@angular/core";
import {Subject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class MapPath {    
    public mapPath: Subject<any> = new Subject();
}