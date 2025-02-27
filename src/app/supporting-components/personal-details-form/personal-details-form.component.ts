import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-personal-details-form',
  standalone: true,
  providers:[provideNativeDateAdapter()],
  imports: [    
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './personal-details-form.component.html',
  styleUrl: './personal-details-form.component.css'
})
export class PersonalDetailsFormComponent {
  @Input() form!:FormGroup;
  genders:any[]=[
      {value:'male', viewValue:'Male'},
      {value:'female', viewValue:'Female'},
      {value:'transgender', viewValue:'Transgender'}
    ]
  getFormValues(){
    const formValues = {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      email: this.form.value.email,
      gender: this.form.value.gender,
      phone: this.form.value.phone,
      dob: new Date(this.form.value.dob).toISOString().split('T')[0]
    }
    return formValues
  }
  getDirtyValues(){
    let result:any = {}
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.controls[key].dirty){
        if (key=="dob"){
          result[key]=new Date(this.form.controls[key].value).toISOString().split('T')[0]
        }
        else{result[key]=this.form.controls[key].value;} 
      }
    });
    return result
  }
}
