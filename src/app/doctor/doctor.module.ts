import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NewExamComponent } from './components/new-exam/new-exam.component';
import { StudentsComponent } from './components/students/students.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NewExamComponent,
    StudentsComponent,
    SubjectsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class DoctorModule { }
