// Two-way binding = Beign able to listen to events and updating
// a property simultaneously [(ngModel)]:

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  // Alert properties:
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! We are logging you in!.';
  inSubmission = false;

  constructor(private auth: AngularFireAuth) {

  }

  async login() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! We are logging you in!.';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );

    } catch (e) {
      this.inSubmission = false;
      this.alertMessage = 'An unexpected error occurred. Please try again later.';
      this.alertColor = 'red';

      console.log(e);

      return
    }

    this.alertMessage = 'Success! You are now logged in.';
    this.alertColor = 'green';
  }
}
