import { Component, Inject, inject} from '@angular/core';
import { ContentService } from '../../services/content.service';
import { OverlayService } from '../../services/overlay.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EditRecordComponent } from '../edit-record/edit-record.component';
import {MatGridListModule} from '@angular/material/grid-list';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-view-record',
  standalone: true,
  imports: [    
      MatGridListModule,
      MatButtonModule,
      CommonModule
    ],
  templateUrl: './view-record.component.html',
  styleUrl: './view-record.component.css'
})

export class ViewRecordComponent {
  contentService = inject(ContentService);
  tiles!:Tile[];
  id!:number;
  imgSources!:string[]
  constructor(@Inject("overlayData") data: any){
    this.id = data.rid;
  }
  async ngOnInit(){
    const [row_data] = await this.contentService.getRecordByID(this.id)
    this.tiles = [
      {text: 'First Name', cols: 1, rows: 1, color: 'lightblue'},
      {text: row_data.first_name, cols: 3, rows: 1, color: 'white'},
      {text: 'Image', cols:2, rows:6, color: 'white'},
      {text: 'Last Name', cols: 1, rows: 1, color: 'lightblue'},
      {text: row_data.last_name, cols: 3, rows: 1, color: 'white'},
      {text: 'E-mail', cols: 1, rows: 1, color: 'lightblue'},
      {text: row_data.email, cols: 3, rows: 1, color: 'white'},
      {text: 'Phone Number', cols: 1, rows: 1, color: 'lightblue'},
      {text: row_data.phone, cols: 3, rows: 1, color: 'white'},
      {text: 'Gender', cols: 1, rows: 1, color: 'lightblue'},
      {text: row_data.gender, cols: 3, rows: 1, color: 'white'},
      {text: 'Date of Birth', cols: 1, rows: 1, color: 'lightblue'},
      {text: new Date(row_data.dob).toISOString().split('T')[0], cols: 3, rows: 1, color: 'white'},
    ]
    this.imgSources = row_data.imageSrc
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
