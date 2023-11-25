import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Role, User} from "../../models/user";
import {Address} from "../../models/address";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // form
  registerForm!: FormGroup;
  // used to show prompt when new user is added
  isSubmitted: boolean = false;

  constructor(public router: Router,
              private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
    // create form group for new review
    let username = new FormControl(null, Validators.required);
    let password = new FormControl(null, Validators.required);
    let firstName = new FormControl(null, Validators.required);
    let lastName = new FormControl(null, Validators.required);
    let email = new FormControl(null, [Validators.required, Validators.email]);
    let phone = new FormControl(null, [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]);
    // address
    let street = new FormControl(null, Validators.required);
    let city = new FormControl(null, Validators.required);
    let postalCode = new FormControl(null, Validators.required);
    let country = new FormControl(null, Validators.required);
    this.registerForm = new FormGroup({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      street: street,
      city: city,
      postalCode: postalCode,
      country: country
    });
  }

  registerUser(formValues: any) {
    if(this.registerForm.valid){
      let address = new Address(formValues.street, formValues.city, formValues.postalCode, formValues.country);
      // ID will be set by the backend automatically
      let user = new User(-1,
        formValues.username,
        formValues.password,
        Role.USER,
        formValues.firstName,
        formValues.lastName,
        formValues.email,
        formValues.phone,
        [address]
      );

      this.authenticationService.registerUser(user);
      this.isSubmitted = true;
      // reset form
      this.registerForm.reset();
    } else {
      console.log('Something went wrong. Please check your input.');
    }
  }

  inputValid() {
    return this.registerForm.valid;
  }

  validateUsername() {
    return this.registerForm.controls['username'].valid || this.registerForm.controls['username'].untouched;
  }

  validatePassword() {
    return this.registerForm.controls['password'].valid || this.registerForm.controls['password'].untouched;
  }

  validateFirstName() {
    return this.registerForm.controls['firstName'].valid || this.registerForm.controls['firstName'].untouched;
  }

  validateLastName() {
    return this.registerForm.controls['lastName'].valid || this.registerForm.controls['lastName'].untouched;
  }

  validateEmail() {
    return this.registerForm.controls['email'].valid || this.registerForm.controls['email'].untouched;
  }

  validatePhone() {
    return this.registerForm.controls['phone'].valid || this.registerForm.controls['phone'].untouched;
  }

  validateStreet() {
    return this.registerForm.controls['street'].valid || this.registerForm.controls['street'].untouched;
  }

  validateCity() {
    return this.registerForm.controls['city'].valid || this.registerForm.controls['city'].untouched;
  }
  validatePostalCode() {
    return this.registerForm.controls['postalCode'].valid || this.registerForm.controls['postalCode'].untouched;
  }

  validateCountry() {
    return this.registerForm.controls['country'].valid || this.registerForm.controls['country'].untouched;
  }
}
