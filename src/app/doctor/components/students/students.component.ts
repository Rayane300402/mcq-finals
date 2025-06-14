import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  ELEMENT_DATA: any[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];
  dataSource: any;
  displayedColumns: any;
  dataTable: any;

  constructor(private auth: AuthService) {
    this.displayedColumns = ['position', 'name', 'subjectName', 'degree'];
    this.dataSource = this.ELEMENT_DATA;
  }


  ngOnInit(): void {
    this.getStudents();
  }


  getStudents() {
    this.auth.getUsers('students').subscribe((res: any) => {
      this.dataSource = res?.map((student: any) => {
        if (student?.subjects ) {
          return student?.subjects?.map((subject: any) => {
            return {
              name: student.username,
              subjectName: subject.name,
              degree: subject.degree
            }
          });
        } else {
          return [{
            name: student.username,
            subjectName: " N/A ",
            degree: " N/A "
          }]
        }
      });
      // console.log(this.dataSource);
      this.dataTable = [];
      
      this.dataSource.forEach((item:any) => {
        item.forEach((subItem:any) => {
          this.dataTable.push(subItem)
        })
      });
  
      this.dataSource = this.dataTable;
      // console.log(this.dataSource);
    }, (err) => {
      console.error(err);
    });
  }

}
