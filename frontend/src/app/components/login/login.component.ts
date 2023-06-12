import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) {}

  async formSubmit(): Promise<void> {
    try {
      if (this.isLoginFormValid()) {
        const response = await this._authService.getCookie(this.username, this.password);
        if (response.status != 200) {
          this.loginError = true;
          console.log(response.json())
        } else {
          let payload = await response.json()
          window.sessionStorage.setItem('authCookie', await payload['tw-auth']);
          this._router.navigate(['']);
        }
      }
    } catch (error) {
      this.loginError = true;
    }
  }

  isLoginFormValid(): boolean {
    return this.email.valid && this.password.trim() !== '';
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
