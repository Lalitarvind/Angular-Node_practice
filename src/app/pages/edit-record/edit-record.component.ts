import { Component, inject, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import { PersonalDetailsFormComponent } from "../../supporting-components/personal-details-form/personal-details-form.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CommunicationService } from '../../services/communication.service';
import { ContentService } from '../../services/content.service';
import { fileSizeValidator } from '../../validators/file-size.validator';

@Component({
  selector: 'app-edit-record',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PersonalDetailsFormComponent,
    CommonModule,
    MatButtonModule
],
  templateUrl: './edit-record.component.html',
  styleUrl: './edit-record.component.css',
})
export class EditRecordComponent {
  fileNames:string[] = []
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
    image: new FormControl(null,[]),
    hidden_file_size: new FormControl([],[fileSizeValidator(10)]),
    country: new FormControl('',[Validators.required]),
    state: new FormControl('',[Validators.required])
  }) 
  overlayService = inject(OverlayService)
  id!:number
  constructor(@Inject("overlayData") data:any){
    this.id=data.rid
  }

  async ngOnInit(){
    this.onReset()
  }

  async onEdit(){
    const response = await this.contentService.updateRecord(this.id, this.formBodyComponent.getDirtyValues())
    console.log(response)
    this.commsService.changeChildData("UPDATE GRID")
    this.overlayService.close()
  }

  async onReset(){
    const [row_data] = await this.contentService.getRecordByID(this.id)
    this.form.setValue({
      first_name:row_data.first_name,
      last_name: row_data.last_name,
      email: row_data.email,
      phone: row_data.phone,
      dob: new Date(row_data.dob),
      gender: row_data.gender,
      image: null,
      hidden_file_size: [],
      country: row_data.country,
      state: row_data.state
    })
    if (row_data.image_path){
      for(let path of row_data.image_path){
        const patharr = path.split('/')
        this.fileNames.push(patharr[patharr.length-1])
      }
    }
  }
  onClose(){
    this.overlayService.close()
  }

  
}
