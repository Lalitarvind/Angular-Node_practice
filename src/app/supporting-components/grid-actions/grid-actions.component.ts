import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { GridRow } from '../../interfaces';
import { OverlayService } from '../../services/overlay.service';
import { EditRecordComponent } from '../../pages/edit-record/edit-record.component';
import { DeletePopupComponent } from '../../pages/delete-popup/delete-popup.component';
import { ViewRecordComponent } from '../../pages/view-record/view-record.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-grid-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `<div class="button-row">
              <div class="flex-container">
                <div class="button-container">
                  <button mat-icon-button aria-label="View Icon" (click)="onViewRecord(params.data)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </div>
                <div class="button-container">
                  <button mat-icon-button aria-label="Edit Icon" (click)="onEditRecord(params.data)">
                    <mat-icon>edit_note</mat-icon>
                  </button>
                </div>
              <div class="button-container">
                  <button mat-icon-button aria-label="Delete Icon" (click)="onDeleteRecord(params.data)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            `,
  styles: `.button-row {
              display: table-cell;
              max-width: 100px;
            }

          .button-container {
              display: flex;
              justify-content: center;
              width: 30px;
            }

          .flex-container {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
            }`
})

export class GridActionsComponent implements ICellRendererAngularComp {
  params:any;
  agInit(params: ICellRendererParams): void {
    this.params = params
  }
  refresh(params: ICellRendererParams) {
      this.params = params
      return true;
  }
  overlayService = inject(OverlayService);
  onViewRecord(rowData:GridRow){
    this.overlayService.open(ViewRecordComponent,{rid:rowData.id})
  }
  onEditRecord(rowData:GridRow){
    this.overlayService.open(EditRecordComponent,{rid: rowData.id})
  } 
  onDeleteRecord(rowData:GridRow){
    this.overlayService.open(DeletePopupComponent,{rids: [rowData.id], delete_message:`Confirm delete of record '${rowData.first_name} ${rowData.last_name}'`})
  }
}
