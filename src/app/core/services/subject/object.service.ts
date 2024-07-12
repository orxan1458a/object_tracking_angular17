import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: 'root' }) 
export class ObjectService{
    public objectCrud:Subject<any>=new Subject();

}