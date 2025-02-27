import { Component, Inject, inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { OverlayService } from '../../services/overlay.service';
import { PersonalDetailsFormComponent } from '../../supporting-components/personal-details-form/personal-details-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EditRecordComponent } from '../edit-record/edit-record.component';

@Component({
  selector: 'app-view-record',
  standalone: true,
  imports: [    
      ReactiveFormsModule,
      PersonalDetailsFormComponent,
      CommonModule,
      MatButtonModule
    ],
  templateUrl: './view-record.component.html',
  styleUrl: './view-record.component.css'
})
export class ViewRecordComponent {
  contentService = inject(ContentService)
  @ViewChild(PersonalDetailsFormComponent) formBodyComponent!: PersonalDetailsFormComponent;
  form:FormGroup = new FormGroup({
    first_name: new FormControl({value:'',disabled:true},[Validators.required]),
    last_name: new FormControl({value:'',disabled:true},[Validators.required]),
    email: new FormControl({value:'',disabled:true},[Validators.required,Validators.email]),
    gender: new FormControl<string|null>({value:null,disabled:true},[Validators.required]),
    phone: new FormControl({value:'',disabled:true},[]),
    dob: new FormControl<Date|null>({value:null,disabled:true},[Validators.required])
  }) 
  id!:number;
  constructor(@Inject("overlayData") data: any){
    this.id = data.rid;
  }
  async ngOnInit(){
    const [row_data] = await this.contentService.getRecordByID(this.id)
    this.form.setValue({
      first_name:row_data.first_name,
      last_name: row_data.last_name,
      email: row_data.email,
      phone: row_data.phone,
      dob: new Date(row_data.dob),
      gender: row_data.gender
    })
  }
  overlayService = inject(OverlayService)
  async onEdit(){
    this.overlayService.close()
    this.overlayService.open(EditRecordComponent,{rid:this.id})
  }
  onClose(){
    this.overlayService.close()
  }
}
