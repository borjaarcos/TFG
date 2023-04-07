import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { LoginComponent } from './login.component'
import { RouterTestingModule } from '@angular/router/testing'


describe('LoginComponent', () => {
    let component: LoginComponent
    let fixture: ComponentFixture<LoginComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
            ],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
        component.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ]),
        })
    })

    it('Email-Check - Invalid email address [format]', () => {
        let email = component.form.controls['email']
        expect(email.valid).toBeFalsy()
        expect(email.pristine).toBeTruthy()
        expect(email.hasError('required')).toBeTruthy()
        email.setValue('adc')
        expect(email.hasError('email')).toBeTruthy()
    })
    it('Email-Check - Valid email address', () => {
        let email = component.form.controls['email']
        expect(email.valid).toBeFalsy()
        expect(email.pristine).toBeTruthy()
        expect(email.hasError('required')).toBeTruthy()
        email.setValue('abc@gmail.com')
        expect(email.hasError('email')).toBeFalsy()
    })
    it('Password-Check - Invalid password [min length]', () => {
        let password = component.form.controls['password']
        expect(password.valid).toBeFalsy()
        expect(password.pristine).toBeTruthy()
        expect(password.hasError('required')).toBeTruthy()
        password.setValue('1234567')
        expect(password.hasError('minlength')).toBeTruthy()
    })
    it('Password-Check - Valid password', () => {
        let password = component.form.controls['password']
        expect(password.valid).toBeFalsy()
        expect(password.pristine).toBeTruthy()
        expect(password.hasError('required')).toBeTruthy()
        password.setValue('Alex12345')
        expect(password.hasError('minlength')).toBeFalsy()
    })

})
