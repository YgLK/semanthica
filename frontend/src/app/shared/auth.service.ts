import {Injectable} from '@angular/core';
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as moment from "moment";
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject} from "rxjs";
const jwtHelper = new JwtHelperService ();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);

  // JWT authentication usage
  // https://blog.angular-university.io/angular-jwt-authentication/#:~:text=Using%20Session%20Information,and%20getExpiration().

  constructor(private http: HttpClient){ //, private currentUserService: CurrentUserService) {
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
      this.setCurrentUser();
      console.log("currentUser", this.currentUser$.getValue());
      // console.log('JWT token received', data);
      // console.log("user_id", this.getCurrentUserId());
      console.log("isLOggedIn", this.isLoggedIn())
    },(error) => {
        // Handle error response
        if (error.status === 401) {
          console.log("Unauthorized - Invalid credentials");
        } else {
          console.error("Error in HTTP post request:", error);
        }
      }
    );
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

  setCurrentUser() {
    if (this.isLoggedIn()) {
      this.http.get<User>('/api/auth/users/me').subscribe(
        (data: any) => {
          // Assuming the received data is a single user, not an array
          const currentUser: User = User.fromJSON(data);
          this.currentUser$.next(currentUser);
        },
        (error) => {
          console.error('Error fetching current user:', error);
          this.currentUser$.next(null); // Set to null in case of an error
        }
      );
    } else {
      this.currentUser$.next(null);
    }
  }

}
