import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor() { }

  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): string {
    return JSON.parse(localStorage.getItem('roles')!);
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  public getToken(): any {
    return localStorage.getItem('jwtToken');
  }

  public setUserId(id: any) {
    localStorage.setItem('id', JSON.stringify(id));
  }

  public getUserId(): any {
    localStorage.getItem('id');
  }

  public clear() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("roles");
    localStorage.removeItem("id");
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

}
