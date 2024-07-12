import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NotificationService {    
    public newNotification: Subject<any> = new Subject();

}