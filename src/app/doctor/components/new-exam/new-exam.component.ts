import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { DoctorService } from '../../services/doctor.service';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss']
})
export class NewExamComponent implements OnInit {
  name = new FormControl("");
  questionForm!: FormGroup;
  questions: any[] = [];
  correctNum: any;
  startAdd: boolean = false;
  preview: boolean = false;
  subjectName: any = '';

  @ViewChildren(MatRadioButton) radios!: QueryList<MatRadioButton>; 

  constructor(private fb: FormBuilder, private toastr: ToastrService, private cdr: ChangeDetectorRef, private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required],
      // correctAnswer:[''],
    });
  }

  createQuestion() {
    if (this.correctNum) {
      const model = {
        question: this.questionForm.value.question,
        answer1: this.questionForm.value.answer1,
        answer2: this.questionForm.value.answer2,
        answer3: this.questionForm.value.answer3,
        answer4: this.questionForm.value.answer4,

        correctAnswer: this.questionForm.value[this.correctNum]
      }
      this.questions.push(model);
      this.clearForm();
      this.toastr.success('تم اضافة السؤال بنجاح');
    } else {
      this.toastr.error('يرجى تحديد الاجابة الصحيحة');
    }
    console.log(this.questions);
  }

  getCorrect(event: any) {
    this.correctNum = event.value;
  }

  submit(stepper: MatStepper) {
    if(this.preview) {
      this.cdr.detectChanges();
      stepper.next();
    } else {
      const model = {
        name: this.subjectName,
        questions: this.questions
      }
      console.log(model);
      this.doctorService.createSubject(model).subscribe((res: any) => {
        if (res.status == 200 || res.status === 201) {
          this.toastr.success('تم انشاء الاختبار بنجاح');
          this.clearForm();
          this.questions = [];
          this.subjectName = '';
          this.name.reset();
          this.startAdd = false;
          this.preview = true;
    
        } else {
          this.toastr.error('حدث خطأ ما');
        }
      },
        (err) => {
          this.toastr.error('حدث خطأ ما');
        }
      );
  
    }
    

  }

  start(stepper: MatStepper): void {
    if (!this.name.value?.trim()) {
      this.toastr.error('يرجى ادخال اسم الاختبار');
      return;
    }

    this.subjectName = this.name.value;
    this.startAdd = true;
    this.cdr.detectChanges();
    stepper.next();
  }

  clearForm() {
    this.questionForm.reset();
    this.correctNum = null;          // clears your own flag

    // clears the radio selection
    this.radios.forEach(radio => radio.checked = false);
  }

  cancel(stepper: MatStepper) {
    this.clearForm();
    this.questions = [];
    this.subjectName = '';
    this.name.reset();
    this.startAdd = false;
    this.cdr.detectChanges();
    stepper.previous();
  }

}
