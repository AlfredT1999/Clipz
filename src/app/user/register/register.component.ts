import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  inSubmission = false;

  // A form control is an object that controls an individual input 
  // field:
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(2)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirm_password = new FormControl('', [
    Validators.required
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ]);

  // A form group is a group of form controls:
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirm_password')]);

  // Alert properties:
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! Your account is beign created.';

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {

  }
 
  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! Your account is beign created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try { 
      await this.auth.createUser(this.registerForm.value as IUser);
    } 
    catch (err) {
      console.error(err);

      this.alertMessage = "An unexpected error occurred";
      this.alertColor = 'red';
      this.inSubmission = false;

      return 
    }

    this.alertMessage = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
