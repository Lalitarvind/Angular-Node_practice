import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { UserDetailsFormComponent } from '../../supporting-components/user-details-form/user-details-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CommunicationService } from '../../services/communication.service';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,UserDetailsFormComponent,MatButtonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  @ViewChild(UserDetailsFormComponent) user_details!:UserDetailsFormComponent
  contentService = inject(ContentService)
  commsService = inject(CommunicationService)
  overlayService = inject(OverlayService)
  user_id!:number;
  form:FormGroup = new FormGroup({
    first_name: new FormControl('',[Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    user_name: new FormControl({value:'',disabled:true},[Validators.required]),
    email: new FormControl({value:'',disabled:true},[Validators.required,Validators.email]),
    phone_number: new FormControl('',[Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]), 
  })

  constructor(@Inject("overlayData") data: any){
    this.user_id = data.user_id
  }

  async ngOnInit(){
    this.onReset()
  }

  async onReset(){
    const [user_data] = await this.contentService.getUserById(this.user_id);
    // console.log(user_data)
    this.form.setValue({
      first_name:user_data.first_name,
      last_name: user_data.last_name,
      user_name: user_data.user_name,
      email: user_data.email,
      phone_number: user_data.phone_number,
      password: user_data.password,
      confirm_password: user_data.password,
      role: user_data.role_id
    })  
  }

  async onSubmit(){
    const updated_values = this.user_details.getDirtyValues()
    console.log(updated_values)
    const resp:any = await this.contentService.updateUser(this.user_id, updated_values) 
    if("error" in resp){
      console.log(resp)
    }
    else{
      this.commsService.changeChildData("UPDATE MORDERATOR GRID")
      this.onClose()
    }
  }

  resetPassword(user_id:number, password:string){
    this.contentService
  }
  
  onClose(){
    this.overlayService.close()
  }
}
