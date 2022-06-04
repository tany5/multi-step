import { Router } from '@angular/router';
import { AuthService } from './../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Passwordmatch } from '../customproviders/passwordmatch';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
  @ViewChild('firstname') firstname: ElementRef

  showLoader: boolean = false
  isEditable = true
  firstFormSubmitted: boolean = false
  secondFormSubmitted: boolean = false

  constructor(private httpClient: HttpClient, private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  firstFormGroup = new FormGroup(
    {
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9 ]{10}")]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    Passwordmatch.mustMatch('password', 'confirmPassword') // insert here
  );

  secondFormGroup = new FormGroup({
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  });

  get first() {
    return this.firstFormGroup.controls;
  }

  get second() {
    return this.secondFormGroup.controls;
  }


  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.firstname.nativeElement.focus());
  }

  onFirstSubmit() {
    this.firstFormSubmitted = true
  }
  onSecondSubmit() {
    this.secondFormSubmitted = true
  }

  submitData() {
    if (!this.secondFormGroup.valid && !this.firstFormGroup.valid) {
      alert("PLease Fill All The Steps To Submit.")
      return false
    }
    this.showLoader = true
    let obj = Object.assign(this.firstFormGroup.value, this.secondFormGroup.value)
    this.authService.signUp(obj.email, obj.password).subscribe((user) => {
      obj.token = user.user.uid
      this.httpClient.post("https://multi-step-new-default-rtdb.firebaseio.com/users.json/", obj).subscribe((res) => {
        localStorage.setItem('token', user.user.uid)
        this.router.navigate(['/dashboard']);
      }, (error) => {
        this._snackBar.open('Sorry!! Something went wrong', 'close', {
          horizontalPosition: 'end',
          verticalPosition: "top"
        });
        this.showLoader = false
        console.log(error)
      })
    },
      (error) => {
        this._snackBar.open('Sorry!! User Already Exists', 'close', {
          horizontalPosition: 'end',
          verticalPosition: "top"
        });
        this.showLoader = false
        console.log(error.message)
      })
  }



}
