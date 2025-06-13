import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  users: any[] = [];
  type: string = 'students';

  constructor(private fb: FormBuilder, private service: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsers();
    this.createForm();
  }


  createForm() {
    this.loginForm = this.fb.group({
      type: [this.type],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  getRole(event: any) {
    this.type = event.value;
    this.getUsers();
  }

  getUsers() {
    this.service.getUsers(this.type).subscribe((res: any) => {
      this.users = res;
    })
  }

  login() {
    this.service.login(this.loginForm.value).subscribe((res: any) => {
      if (res) {
        localStorage.setItem('token', res.token);
        this.router.navigate(['dashboard']);
      }
    }, (error) => {
      this.toastr.error('Invalid credentials');
    })
  }

  submit() {
    let index = this.users.findIndex((item: any) => item.email == this.loginForm.value.email && item.password == this.loginForm.value.password);

    if (index == -1) {
      this.toastr.error('الايميل او كلمة المورور غير صحيحة', "", {
        timeOut: 5000,
        disableTimeOut: false,
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        closeButton: true
      });
      return;
    } else {
      const model = {
        username : this.users[index].username,
        role: this.type,
        userId: this.users[index].id,
      }
    
   
      this.service.login(model).subscribe((res: any) => {
        this.service.user.next(res);
        this.toastr.success('تم تسغيل الدخول بنجاح', "", {
          timeOut: 5000,
          disableTimeOut: false,
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          closeButton: true
        });
        this.router.navigate(['/subjects']);
      })
    }


  }


}
