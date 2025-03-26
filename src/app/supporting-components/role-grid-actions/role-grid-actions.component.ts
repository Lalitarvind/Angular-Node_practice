import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-role-grid-actions',
  standalone: true,
   imports: [MatIconModule, MatButtonModule],
    template: `<div class="button-row">
                <div class="flex-container">
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
export class RoleGridActionsComponent implements ICellRendererAngularComp{
  params:any;
    agInit(params: ICellRendererParams): void {
      this.params = params
    }
    refresh(params: ICellRendererParams) {
        this.params = params
        return true;
    }
    overlayService = inject(OverlayService);
    onEditRecord(rowData:any){
      if (this.params.actions?.edit){
        this.params.actions.edit(rowData)
      }
    } 
    onDeleteRecord(rowData:any){
      if (this.params.actions?.delete){
        this.params.actions.delete(rowData)
      }
    }
}
