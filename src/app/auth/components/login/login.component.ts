import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.http.get('http://localhost:3000/users').subscribe((res)=>{
      console.log(res);
    })
  }

}
