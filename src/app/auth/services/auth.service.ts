import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user= new Subject<any>();

  constructor(private http:HttpClient) { }


  createUser(model:any){
    return this.http.post(environment.baseApi+'students', model);
  }

  getUsers(type:String){
    return this.http.get(environment.baseApi+type);
  }

  login(model:any){
    return this.http.put(environment.baseApi+'login/1', model);
  }

  getRole(){
    return this.http.get(environment.baseApi+'login/1');
  }
  
}
