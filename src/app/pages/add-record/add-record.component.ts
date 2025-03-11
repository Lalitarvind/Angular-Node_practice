import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { PersonalDetailsFormComponent } from "../../supporting-components/personal-details-form/personal-details-form.component";
import { OverlayService } from '../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../services/content.service';
import { CommunicationService } from '../../services/communication.service';
import { fileSizeValidator } from '../../validators/file-size.validator';
@Component({
  selector: 'app-add-record',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PersonalDetailsFormComponent,
    CommonModule,
    MatButtonModule
],
  templateUrl: './add-record.component.html',
  styleUrl: './add-record.component.css',
})
export class AddRecordComponent {
  commsService = inject(CommunicationService)
  contentService = inject(ContentService)

  @ViewChild(PersonalDetailsFormComponent) formBodyComponent!: PersonalDetailsFormComponent;
  form:FormGroup = new FormGroup({
    first_name: new FormControl('',[Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    gender: new FormControl<string|null>(null,[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    dob: new FormControl<Date|null>(null,[Validators.required]),
    image: new FormControl(null, []),
    hidden_file_size: new FormControl([],[fileSizeValidator(10)])
  }) 
  overlayService = inject(OverlayService)
  async onSubmit(){
    const response = await this.contentService.createRecord(this.formBodyComponent.getFormValues())
    console.log(response)
    this.commsService.changeChildData("UPDATE GRID")
    this.overlayService.close()
  }
  onClose(){
    this.overlayService.close()
  }
}
