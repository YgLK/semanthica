import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  constructor(private http: HttpClient) { }


  registerUser(user: User) {
    this.http.post(
      '/api/register', // TODO
      user.toJSON(),
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('user registered');
    });
  }

  loginUser(userName: string, password: string) {
    // TODO
  }
}
