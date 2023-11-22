import {Injectable} from '@angular/core';
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as moment from "moment";
import {JwtHelperService} from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService ();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null;

  // JWT authentication usage
  // https://blog.angular-university.io/angular-jwt-authentication/#:~:text=Using%20Session%20Information,and%20getExpiration().

  constructor(private http: HttpClient) {
    this.currentUser = null;
  }
  registerUser(user: User) {
    this.http.post(
      '/api/register', // TODO
      user.toJSON(),
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('user registered');
    });
  }

  login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post(
      '/api/auth/token',
      formData
    ).subscribe((data: any) => {
      this.setSession(data);
      // console.log('JWT token received', data);
      // console.log("user_id", this.getCurrentUserId());
      console.log("isLOggedIn", this.isLoggedIn())
    });
  }

  private setSession(authResult: any) {
    const decodedToken = jwtHelper.decodeToken(authResult.access_token);

    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem("expires_at", JSON.stringify(decodedToken.exp));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at")!;

    // in seconds
    const expiresAt = JSON.parse(expiration);
    // in miliseconds
    const currentTimestamp = moment().valueOf() / 1000;

    if (localStorage.getItem("expires_at") === null || currentTimestamp > expiresAt) {
      return moment();
    }

    // moment takes input in milliseconds
    return moment(expiresAt * 1000);
  }

  getToken() {
    if(this.isLoggedIn()){
      return localStorage.getItem("access_token");
    }
    return null;
  }

  getCurrentUserId() {
    const token = localStorage.getItem("access_token"); // Replace "your_token_key" with the actual key used to store the token

    if (token && !jwtHelper.isTokenExpired(token)) {
      const decodedToken = jwtHelper.decodeToken(token);
       // Replace with the actual key used in your token for the user ID
      return decodedToken.id;
    }
    return null; // Return null if there is no valid token or an error occurred
  }
}
