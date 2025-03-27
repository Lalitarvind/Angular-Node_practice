import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ContentService } from '../../services/content.service';
import { role } from '../../interfaces';

@Component({
  selector: 'app-user-details-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './user-details-form.component.html',
  styleUrl: './user-details-form.component.css'
})
export class UserDetailsFormComponent implements OnInit{
  @Input({required:true}) form!:FormGroup
  private contentService = inject(ContentService)
  roles!:role[]
  
  async ngOnInit(){
    this.roles = await this.contentService.getRoleInfo()
  }

  getFormValues(){
    let formData = {
      'first_name': this.form.value.first_name,
      'last_name': this.form.value.last_name,
      'email': this.form.value.email,
      'user_name': this.form.value.user_name,
      'phone': this.form.value.phone,
      'password': this.form.value.password,
      'role_id': this.form.value.role
    }
    return formData
  }

  getDirtyValues(){
    let dirty_values:any = {}
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.controls[key].dirty){
          dirty_values[key]=this.form.controls[key].value
      }
    });
    return dirty_values;
  }

}
