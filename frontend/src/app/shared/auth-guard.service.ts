import {Injectable} from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import { AuthService } from "./auth.service";
import {filter, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.authService.setCurrentUser();
    }
  }

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      filter(currentUser => currentUser !== undefined),
      map(currentUser => {
        console.log("currentUser", currentUser)
        if (!currentUser) {
          console.log("Unauthorized - Invalid credentials")
          this.router.navigate(['/login']);
          return false;
        } else {
          console.log("Authorized")
          return true;
        }
      })
    );
  }
}
