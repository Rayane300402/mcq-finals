import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    BrowserModule
  ],
  exports:[
    HttpClientModule,
    BrowserModule,
    RouterModule,
    MaterialModule,
    CommonModule,
    NavbarComponent
  ]
})
export class SharedModule { }
