import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    hide: boolean = true
    email = new FormControl('', [Validators.required, Validators.email])
    password = new FormControl('', [
        Validators.required,
        Validators.minLength(8),
    ])
    form = new FormGroup({
        email: this.email,
        password: this.password,
    })
    errorMsg: string = ''

    constructor(
        private _router: Router
    ) {}

    ngOnInit(): void {}

    async formSubmit(): Promise<void> {
        if (this.form.valid) {



        }
    }

    getEmailErrorMessage(): string {
        let msg: string = ''

        if (this.email.hasError('required')) {
            msg = 'Debes introducir un correo'
        } else if (this.email.hasError('email')) {
            msg = 'La dirección de correo no es válida'
        }

        return msg
    }

    getPasswordErrorMessage(): string {
        let msg: string = ''

        if (this.password.hasError('required')) {
            msg = 'Debes introducir una contraseña'
        } else if (this.password.hasError('minlength')) {
            msg = 'La contraseña debe tener al menos 8 caracteres'
        }

        return msg
    }
}
