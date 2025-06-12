import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  id:any;
  subject:any;
  user:any = {};

  constructor(private route: ActivatedRoute, private doctorService: DoctorService, private toastr: ToastrService, private auth: AuthService) { 
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Exam ID:', this.id);
  }

  ngOnInit(): void {
    this.getSubject();
    this.getUserInfo();
  }

  getSubject() {
    this.doctorService.getSubject(this.id).subscribe((res: any) => {
      console.log('Exam Data:', res);    
      this.subject = res;
    });
  }

    getUserInfo(){
    this.auth.getRole().subscribe((res:any)=>{
      this.user = res;
    }
    , (err:any)=>{
      console.error('Error fetching user info:', err); 
    }
    );
  }

    delete(index: number) {
    this.subject.questions.splice(index, 1);
    const model = {
      name: this.subject,
      questions:  this.subject.questions
    }
    this.doctorService.updateSubject(model, this.id).subscribe((res: any) => {
      console.log(res);
      this.toastr.success('تم حذف السؤال بنجاح');
    }, (err) => {
      console.error(err);
      this.toastr.error('حدث خطأ ما أثناء حذف السؤال');
    });

  }

}
