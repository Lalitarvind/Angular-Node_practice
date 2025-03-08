import { Component, inject} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; 
import type { ColDef,  RowSelectionOptions, SelectionChangedEvent } from 'ag-grid-community'; 
import { GridActionsComponent } from '../grid-actions/grid-actions.component';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GridRow } from '../../interfaces';
import { ContentService } from '../../services/content.service';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { GridImageComponent } from '../grid-image/grid-image.component';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridAngular,CommonModule],
  template: `<ag-grid-angular
              style="width: 100%; height: 100%;"
              [rowData]="rowData$ | async"
              [columnDefs]="colDefs" 
              [rowSelection]="rowSelection"
              (selectionChanged)="onSelectionChanged($event)"
              [pagination]="pagination"
              [paginationPageSize]="paginationPageSize"
              [paginationPageSizeSelector]="paginationPageSizeSelector"
            />`
})

export class GridComponent {

  rowData$ = new BehaviorSubject<GridRow[]>([])
  selectedData$ = new BehaviorSubject<GridRow[]>([])
  contentService = inject(ContentService)
  themeClass:string = 'ag-theme-quartz'
  pagination = true;
  paginationPageSize = 50;
  paginationPageSizeSelector = [10, 20, 50];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    headerCheckbox: true,
    enableSelectionWithoutKeys: true
  };

  private dateFormatter(params:any):string{
    return new Date(params.value).toISOString().split('T')[0]
  }
  colDefs: ColDef[] = [
    {field:"id", hide:true},
    {field:"visibility",hide:true},
    {field:"first_name", headerName:"First Name", flex:1, filter: true, floatingFilter: true },
    {field:"last_name", headerName:"Last Name", flex:1, filter: true, floatingFilter: true },
    {field:"email",headerName:"Email",flex:2, filter: true, floatingFilter: true },
    {field:"dob",headerName:"D.O.B",flex:1,valueFormatter:this.dateFormatter},
    {field:"phone",headerName:"Phone",flex:1},
    {field:"gender",headerName:"Gender",flex:1},
    {field:"image_path", hide:true},
    {field:"imageSrc",headerName:"Image",cellRenderer:GridImageComponent,flex:1},
    {field:"grid_actions", cellRenderer: GridActionsComponent,flex:1}
  ]

  ngOnInit(){
   this.updateTableRows();
  }
  onSelectionChanged(event:SelectionChangedEvent){
    this.selectedData$.next(event.api.getSelectedRows().map(row => row.id))
  }

  async updateTableRows(){
    const records:any[] = await this.contentService.getVisibleRecords();
    this.rowData$.next(records);
  }
}