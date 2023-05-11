import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { AuthenticationService } from '../../services/authentication.service'
import {Router} from "@angular/router";

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  username : string ="";
  password : string ="";
  show: boolean= false;
  constructor(
        private _router: Router,
        private _authService: AuthenticationService
    ) {}

  async formSubmit(): Promise<void> {
    window.sessionStorage.setItem('authCookie', await this._authService.getCookie(this.username, this.password));
    this._router.navigate(['']);
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
