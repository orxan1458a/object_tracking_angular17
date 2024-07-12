import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserServiceDB{

  url: string = environment.rest_api;

  constructor(
    private http: HttpClient,

  ) { }

  addUser(user: any) {
    return this.http.post(this.url + '/createUser', user,{responseType:'text'});
  }

  resetPassword(passwordForm: any) {
    return this.http.post(this.url + '/resetPassword', passwordForm);
  }

  getAllUsers() {
    return this.http.get(this.url + "/allUsers");
  }

  getUsernameList() {
    return this.http.get(this.url + "/usernameList");
  }

  updateUserSetting(user: any) {
    console.log(user)
    return this.http.post(this.url + '/updateUserSetting', user,{responseType:'text'});
  }

  deleteUser(user_id: number) {
    return this.http.get<any>(this.url + '/deleteUser/'+user_id );
  }

  updateUser(user_id: number) {
    return this.http.get<any>(this.url + '/getUserForSetting/' + user_id);
  }

  logout() {
    return this.http.get(this.url + "/userLogout",{responseType:'text'});
  }

}