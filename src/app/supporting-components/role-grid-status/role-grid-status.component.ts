import { Component, inject } from '@angular/core';
import { Form, FormControl, FormsModule } from '@angular/forms';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-role-grid-status',
  standalone: true,
  imports: [MatSlideToggleModule],
  template: `<mat-slide-toggle [checked]="isChecked" (change)="onToggle(params.data.id, $event)"></mat-slide-toggle>`,
  styles: ``
})
export class RoleGridStatusComponent implements ICellRendererAngularComp{
  params:any;
  private contentService = inject(ContentService)
  isChecked!:boolean
  agInit(params: ICellRendererParams): void {
    this.params = params
    this.isChecked = params.value==1? true : false
  }
  refresh(params: ICellRendererParams) {
      this.params = params
      return true;
  }
  async onToggle(id:number, event:MatSlideToggleChange){
    this.isChecked = event.checked
    if (this.params.OnAction){
      this.params.OnAction(this.params.data, this.isChecked)
    }
  }
}
