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

  id: any;
  subject: any;
  user: any = {};
  studentInfo: any;
  total: number = 0;
  showResult: boolean = false;
  userSubjects: any[] = [];

  constructor(private route: ActivatedRoute, private doctorService: DoctorService, private toastr: ToastrService, private auth: AuthService) {
    this.id = this.route.snapshot.paramMap.get('id');
    // console.log('Exam ID:', this.id);
  }

  ngOnInit(): void {
    this.getSubject();
    this.getLoggedInUser();
  }

  getSubject() {
    this.doctorService.getSubject(this.id).subscribe((res: any) => {
      // console.log('Exam Data:', res);    
      this.subject = res;
    });
  }

  getLoggedInUser() {
    this.auth.getRole().subscribe((res: any) => {
      this.user = res;
      this.getUserData(); // Fetch user data after getting the role
    }
      , (err: any) => {
        console.error('Error fetching user info:', err);
      }
    );
  }

  getUserData() {
    this.auth.getStudent(this.user.userId).subscribe((res: any) => {
      this.studentInfo = res;
      this.userSubjects = res.subjects || []; // Ensure subjects is defined
      // console.log('User Data:', this.studentInfo);
    }, (err: any) => {
      console.error('Error fetching user data:', err);
    });
  }

  delete(index: number) {
    this.subject.questions.splice(index, 1);
    const model = {
      name: this.subject,
      questions: this.subject.questions
    }
    this.doctorService.updateSubject(model, this.id).subscribe((res: any) => {
      console.log(res);
      this.toastr.success('تم حذف السؤال بنجاح');
    }, (err) => {
      console.error(err);
      this.toastr.error('حدث خطأ ما أثناء حذف السؤال');
    });

  }

  getAnswer(event: any) {
    let value = event.value,
      questionIndex = event.source.name;

    this.subject.questions[questionIndex].selectedAnswer = value; // Store the selected answer in the question object, creating a new property
    console.log('Updated Question:', this.subject.questions);
    console.log('Selected Answer:', event);
  }

  getResult() {
    this.total = 0; // Reset total before calculating

    this.subject.questions.forEach((question: any) => {
      if (question.selectedAnswer == question.correctAnswer) {
        this.total++;
      }
    });

    this.toastr.success(`تم الانتهاء من الامتحان بنجاح`);
    this.showResult = true;
    this.userSubjects.push({
        name: this.subject.name,
        id: this.id,
        degree: this.total,
        total: this.total,
      });

    const model = {
      usrername: this.studentInfo.username,
      email: this.studentInfo.email,
      password: this.studentInfo.password,
      subjects: this.userSubjects,
    }

    this.auth.updateStudent(this.studentInfo.id, model).subscribe((res: any) => {
      console.log('Updated User Data:', res);
      this.toastr.success('تم تحديث بيانات الطالب بنجاح');
    }, (err: any) => {
      console.error('Error updating user data:', err);
      this.toastr.error('حدث خطأ ما أثناء تحديث بيانات الطالب');
    });
  }

}
