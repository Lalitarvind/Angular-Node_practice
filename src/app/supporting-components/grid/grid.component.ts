import { Component, SimpleChange } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; 
import type { ColDef, DateStringAdvancedFilterModel, RowSelectionOptions, SelectionChangedEvent } from 'ag-grid-community'; 
import { GridActionsComponent } from '../grid-actions/grid-actions.component';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

interface table_row{
  first_name:string,
  last_name:string,
  email:string,
  dob:Date,
  phone:string,
  gender:string
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridAngular,CommonModule],
  template: `<ag-grid-angular
              style="width: 100%; height: 100%;"
              [rowData]="rowData$ | async"
              [columnDefs]="colDefs" 
              [rowSelection]="rowSelection"
              [rowMultiSelectWithClick]=true
              (selectionChanged)="onSelectionChanged($event)"
              [class]="themeClass"
              [pagination]="pagination"
              [paginationPageSize]="paginationPageSize"
              [paginationPageSizeSelector]="paginationPageSizeSelector"
            />`
})
export class GridComponent {

  rowData$ = new BehaviorSubject<table_row[]>([])

  themeClass:string = 'ag-theme-quartz'
  pagination = true;
  paginationPageSize = 500;
  paginationPageSizeSelector = [10, 20, 50];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    headerCheckbox: true,
  };
  colDefs: ColDef[] = [
    {field:"first_name", headerName:"First Name", flex:1, filter: true, floatingFilter: true },
    {field:"last_name", headerName:"Last Name", flex:1, filter: true, floatingFilter: true },
    {field:"email",headerName:"Email",flex:2, filter: true, floatingFilter: true },
    {field:"dob",headerName:"D.O.B",flex:1},
    {field:"phone",headerName:"Phone",flex:1},
    {field:"gender",headerName:"Gender",flex:1},
    {field:"grid_actions", cellRenderer: GridActionsComponent,flex:1}
  ]

  onSelectionChanged(event:SelectionChangedEvent){
    console.log(event.api.getSelectedRows());
  }
}