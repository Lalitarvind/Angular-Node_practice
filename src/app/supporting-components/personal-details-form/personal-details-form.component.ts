import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ContentService } from '../../services/content.service';

interface DropdownOptions{
  "value": string,
  "display": string
}
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

export class PersonalDetailsFormComponent implements OnInit{
  @Input() form!:FormGroup;
  @Input() fileNames:string[]=[];
  selectedImages!:File[];
  countryOptions:any[]=[]
  stateOptions:any[]=[]

  contentService = inject(ContentService)
  genders:any[]=[
      {value:'male', viewValue:'Male'},
      {value:'female', viewValue:'Female'},
      {value:'transgender', viewValue:'Transgender'}
    ]

  async ngOnInit(){
    this.countryOptions = await this.contentService.getCountryOptions();
  }

  async onCountrySelectionChange(event:any){
    this.form.get('state')?.reset();
    this.form.get('state')?.disable();
    this.stateOptions = await this.contentService.getStateOptions(event.source.value);
    this.form.get('state')?.enable();
  }

  onFileSelected(event: any) {
      this.selectedImages = Array.from(event.target.files);
      let imgSizes:number[] = []
      this.selectedImages.forEach((img)=>{
        this.fileNames.push(img.name);
        imgSizes.push(img.size)
      });
      this.form.patchValue({
        hidden_file_size:imgSizes
      })
      this.form.get('hidden_file_size')?.markAsTouched()
    }

  getFormValues(){
    const formData = new FormData();
    this.selectedImages.forEach((img)=>formData.append('files',img))
    formData.append('jsondata',JSON.stringify({
      'first_name': this.form.value.first_name,
      'last_name': this.form.value.last_name,
      'email': this.form.value.email,
      'gender': this.form.value.gender,
      'phone': this.form.value.phone,
      'dob': new Date(this.form.value.dob).toISOString().split('T')[0],
      'country': this.form.value.country,
      'state': this.form.value.state
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
          this.selectedImages.forEach((img)=>updates.append('files',img))
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
