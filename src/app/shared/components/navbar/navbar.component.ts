import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any = null;

  constructor(private service: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.user.subscribe((res: any) => {
      if (res.role) {
        this.user = res;
      }
      console.log(this.user);
    });

  }


  logout() {
    if (this.user != null) {
      const model = {}
      this.service.login(model).subscribe((res: any) => {
        this.user = null;
        this.service.user.next(res);
        this.toastr.success('تم الخروج بنجاح', "", {
          timeOut: 5000,
          disableTimeOut: false,
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          closeButton: true
        });
      });
    }
  }
}
