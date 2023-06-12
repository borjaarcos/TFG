import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _router: Router, private http:HttpClient) { }

  async projects(cookie: string): Promise<any>  {
     const response = await fetch('http://127.0.0.1:5000/'+cookie, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    const  payload = await response.json()

    return Promise.resolve(payload)
  }

  async getCookie(username: string, pass: string): Promise<any> {
    const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: pass,
            }),
        })
    return response


  }
  isLoggedIn(){
    let logged: boolean = false;
    if( window.sessionStorage.getItem('authCookie'))
      logged = true;
    return logged != false;
    return logged;

  }

}
