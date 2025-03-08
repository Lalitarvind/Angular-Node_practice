import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './personal-details-form.component.html',
  styleUrl: './personal-details-form.component.css'
})
export class PersonalDetailsFormComponent {
  @Input() form!:FormGroup;
  @Input() fileName!:string;
  selectedImage!:File;
  genders:any[]=[
      {value:'male', viewValue:'Male'},
      {value:'female', viewValue:'Female'},
      {value:'transgender', viewValue:'Transgender'}
    ]
  onFileSelected(event: any) {
      this.selectedImage = event.target.files[0];
      this.fileName = this.selectedImage.name;
      this.form.patchValue({
        hidden_file_size:this.selectedImage.size
      })
      this.form.get('hidden_file_size')?.markAsTouched()
    }
  getFormValues(){
    const formData = new FormData();
    formData.append('file', this.selectedImage);
    formData.append('jsondata',JSON.stringify({
      'first_name': this.form.value.first_name,
      'last_name': this.form.value.last_name,
      'email': this.form.value.email,
      'gender': this.form.value.gender,
      'phone': this.form.value.phone,
      'dob': new Date(this.form.value.dob).toISOString().split('T')[0]
  }))
    return formData
  }
  getDirtyValues(){
    let updates:FormData = new FormData();
    let jsondata:any = {}
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.controls[key].dirty){
        if (key=="dob"){
          jsondata[key]=new Date(this.form.controls[key].value).toISOString().split('T')[0];
        }
        else if(key=="image"){
          updates.append('file',this.selectedImage);
        }
        else if(key=="hidden_file_size"){
          return
        }
        else{
          jsondata[key]=this.form.controls[key].value
        } 
      }
    });
    updates.append('jsondata', JSON.stringify(jsondata))
    return updates;
  }
}
