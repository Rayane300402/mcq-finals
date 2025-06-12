import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  constructor(private doctorService: DoctorService, private auth: AuthService) { }

  subjects: any[] = [];
  user:any = {};

  ngOnInit(): void {
    this.getSubjects();
    this.getUserInfo();
  }

  getSubjects() {
    this.doctorService.getAllSubjects().subscribe((res: any) => {
      this.subjects = res;
      console.log(this.subjects);
    }, (err: any) => {
      console.error('Error fetching subjects:', err); 
    
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

  delete(index:any){
    let id = this.subjects[index].id;
    this.subjects.splice(index, 1);
    
    this.doctorService.deleteSubject(id).subscribe((res:any)=>{
      console.log('Subject deleted successfully');
    }, (err:any)=>{
      console.error('Error deleting subject:', err); 
    });

  }

}
