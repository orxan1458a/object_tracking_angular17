import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  public profil_service:Subject<any> = new Subject();
}