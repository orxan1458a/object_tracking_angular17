import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathService {
  public path_data:Subject<google.maps.LatLngLiteral[]> = new Subject();
}