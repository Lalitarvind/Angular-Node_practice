import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { UserDetailsFormComponent } from "../../supporting-components/user-details-form/user-details-form.component";
import { CommunicationService } from '../../services/communication.service';
import { OverlayService } from '../../services/overlay.service';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-morderator',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, UserDetailsFormComponent,MatButtonModule],
  templateUrl: './create-morderator.component.html',
  styleUrl: './create-morderator.component.css'
})
export class CreateMorderatorComponent {
  @ViewChild(UserDetailsFormComponent) user_details!:UserDetailsFormComponent
  form:FormGroup = new FormGroup({
    first_name: new FormControl('',[Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    user_name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    phone_number: new FormControl('',[Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]), 
  },
  { validators: passwordMatchValidator('password', 'confirm_password') } 
) 

  contentService = inject(ContentService)
  commsService = inject(CommunicationService)
  overlayService = inject(OverlayService)
  async onSubmit(){
    const response = await this.contentService.createMorderator(this.user_details.getFormValues())
    console.log(response)
    this.commsService.changeChildData("UPDATE MORDERATOR GRID")
    this.overlayService.close()
  }
  onClose(){
    this.overlayService.close()
  }
}
