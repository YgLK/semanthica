import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // form
  loginForm!: FormGroup;
  //if all fields are filled correctly, changes submit button from disabled to enabled and vice versa
  fieldsCorrect: boolean = false;
  isSubmitted:boolean = false;

  constructor(public router: Router,
              private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
    // create form group for new review
    let username = new FormControl(null, Validators.required);
    let password = new FormControl(null, Validators.required);
    this.loginForm = new FormGroup({
      username: username,
      password: password,
    });
  }

  login(){
    if (this.loginForm.valid){
      this.authenticationService.login(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value
      );
    } else {
      console.log("Invalid form")
    }
  }

  validateUsername() {
    return this.loginForm.controls['username'].valid || this.loginForm.controls['username'].untouched;
  }

  validatePassword() {
    return this.loginForm.controls['password'].valid || this.loginForm.controls['password'].untouched;;
  }
}
