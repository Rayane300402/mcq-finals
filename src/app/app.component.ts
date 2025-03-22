import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private service:AuthService) { }
 

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(){
    this.service.getRole().subscribe((res:any)=>{
      this.service.user.next(res);
    });
  }

}
