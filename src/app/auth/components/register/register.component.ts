import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm!: FormGroup;
  students: any[] = [];

  constructor(private fb: FormBuilder, private service: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createForm();
    this.getStudents();
  }

  createForm() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  getStudents() {
    this.service.getUsers('students').subscribe((res: any) => {
      this.students = res;
    })
  }

  // submit() {
  //   const model = {
  //     id: this.students.length > 0 ? Math.max(...this.students.map((s: any) => s.id)) + 1 : 1, // Generate next sequential ID
  //     username: this.userForm.value.username,
  //     email: this.userForm.value.email,
  //     password: this.userForm.value.password
  //   }

  //   let index = this.students.findIndex((student: any) => student.email == this.userForm.value.email);

  //   if (index !== -1) {
  //     this.toastr.error('الايميل موجود مسبقا',"", {
  //       timeOut: 5000,
  //       disableTimeOut: false,
  //       titleClass: 'toast-title',
  //       messageClass: 'toast-message',
  //       closeButton: true
  //     });
  //     return;
  //   } else {
  //     this.service.createUser(model).subscribe((res: any) => {
  //       this.toastr.success('تم اضافة الطالب بنجاح',"", {
  //         timeOut: 5000,
  //         disableTimeOut: false,
  //         titleClass: 'toast-title',
  //         messageClass: 'toast-message',
  //         closeButton: true
  //       });
  //       // TODO: DOES NOT SHOW NAME OR ROLE WHEN NAVIGATING
  //       this.router.navigate(['/subjects']);
  //     })
  //   }


  // }

  // register.component.ts


  submit(): void {
    if (this.userForm.invalid) { return; }

    // Don’t pre-compute the ID; let json-server add it
    const newUser = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password
    };

    // 1️⃣ Make sure the email is unique
    const emailExists = this.students.some(s => s.email === newUser.email);
    if (emailExists) {
      this.toastr.error('الايميل موجود مسبقاً');
      return;
    }

    // 2️⃣ Chain: create user ➜ update /login/1 ➜ route away
    this.service.createUser(newUser).pipe(
      tap(() => this.toastr.success('تم إضافة الطالب بنجاح')),
      switchMap((created: any /*← response from POST */) => {
        /** object that will replace /login/1 **/
        const loginModel = {
          id: 1,              // KEEP the same primary key
          username: created.username,
          role: 'students',
          userId: created.id      // 💡 ID we just got back
        };
        return this.service.login(loginModel);
      })
    ).subscribe({
      next: (logged: any) => {
        this.service.user.next(logged);          // push into Subject
        localStorage.setItem('user', JSON.stringify(logged));
        this.toastr.success('تم تسجيل الدخول بنجاح');
        this.router.navigate(['/subjects']);
      },
      error: () => this.toastr.error('تعذّر إنشاء الحساب')
    });
  }


}
