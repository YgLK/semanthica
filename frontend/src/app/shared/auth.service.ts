import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  constructor(private http: HttpClient) { }

  loginUser(userName: string, password: string) {
    let loginInfo = {username: userName, password: password};
    let options = {headers: {'Content-Type': 'application/json'}};
    this.http.post('/api/login', loginInfo, options)
      .pipe(tap(data => {
        this.currentUser = <User>data['user'];
        //   TODO: authentication and authorization
        //    + admin views described in instructions

      }))
    // this.currentUser = {
    //   id: 1,
    //   username: 'admin',
    //   firstName: 'John',
    //   lastName: 'Papa'
    // }
  }
}
