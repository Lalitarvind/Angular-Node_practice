import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import {MatMenuModule} from '@angular/material/menu'
@Component({
  selector: 'app-grid-image',
  standalone: true,
  imports: [MatMenuModule],
  template: `<div class="button-row">
                <div class="flex-container" [matMenuTriggerFor]="menu">
                  <img [src]="this.params.value[0]" alt='image' class="img-thumbnail"/>
                </div>
                <mat-menu #menu="matMenu">
                  @for (src of this.params.value; track $index) {
                    <div class="image-container" mat-menu-item>
                      <img [src]="src" alt='image' class="img-fluid img-thumbnail"/>
                    </div>
                  }
                </mat-menu>
              </div>`,
  styles: `.button-row {
              display: table-cell;
              max-width: 100px;
            }

          .flex-container {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
            }
          image{
            max-width: 30px;
          }`
})
export class GridImageComponent implements ICellRendererAngularComp{
  params:any;
  agInit(params: ICellRendererParams): void {
    this.params = params
  }
  refresh(params: ICellRendererParams) {
      this.params = params
      return true;
  }
}
