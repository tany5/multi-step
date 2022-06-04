import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userID: string
  user: any = []
  users: any = []
  showUser: boolean = false
  filteredUsers: any = []
  constructor(private db: AngularFireDatabase, private authService: AuthService, private router:Router) { }

  async ngOnInit(): Promise<void> {
    this.userID = localStorage.getItem('token')
    this.db.object("/users/").valueChanges().
      subscribe(val => { this.filterData(val) });
  }

  logOut() {
    this.authService.logOut()
  }

  filterData(arry) {
    const mapped = Object.keys(arry).map(key => ({ type: key, value: arry[key] }));
    const user = mapped.filter((user) => {
      return user.value.token == this.userID
    })
    console.log(user)
    
    if(user.length > 0){
      this.user = user[0].value
      this.showUser = true
    }
    else{
      localStorage.clear()
      this.router.navigate(['/login'])
    }
    
  }

}
