import { AuthService } from './../shared/auth.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('email') email: ElementRef

  showLoader: boolean = false

  loginFormSubmitted: boolean = false
  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
  });

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.email.nativeElement.focus());
  }
  get login() {
    return this.loginFormGroup.controls;
  }
  onLogin() {
    this.loginFormSubmitted = true
    if (this.loginFormGroup.valid) {
      this.showLoader = true
      this.authService.login(this.loginFormGroup.value.email, this.loginFormGroup.value.password)
        .subscribe((res) => {
          this.showLoader = false
          localStorage.setItem('token', res.user.uid)
          this.router.navigate(['/dashboard']);
        },
          (error) => {
            this.showLoader = false
            this._snackBar.open('Sorry!! Login Failed', 'close', {
              horizontalPosition: 'end',
              verticalPosition: "top"
            });
            console.log(error)
          })
    }
  }

}
