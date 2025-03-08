import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OverlayService } from '../../services/overlay.service';
import { MatInputModule } from '@angular/material/input';
import { ContentService } from '../../services/content.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatButtonModule,MatInputModule],
  templateUrl: './import-dialog.component.html',
  styleUrl: './import-dialog.component.css'
})
export class ImportDialogComponent {
  overlayService = inject(OverlayService)
  records!:any[]
  selectedFile!:File;
  contentService = inject(ContentService)
  commsService = inject(CommunicationService)

  form:FormGroup = new FormGroup({
    file_select: new FormControl('',[Validators.required])
  })

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  async onSubmit(){
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    let response = await this.contentService.importRecords(formData)
    console.log(response)
    this.commsService.changeChildData("UPDATE GRID")
    this.onClose()
  }
  onClose(){
    this.overlayService.close();
  }
}
