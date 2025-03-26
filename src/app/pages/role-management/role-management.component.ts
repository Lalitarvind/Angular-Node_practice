import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OverlayService } from '../../services/overlay.service';
import { CreateRoleComponent } from '../create-role/create-role.component';
import type { ColDef } from 'ag-grid-community'; 
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular'; 
import { BehaviorSubject } from 'rxjs';
import { ContentService } from '../../services/content.service';
import { CommunicationService } from '../../services/communication.service';
import { RoleGridStatusComponent } from '../../supporting-components/role-grid-status/role-grid-status.component';
import { RoleGridActionsComponent } from '../../supporting-components/role-grid-actions/role-grid-actions.component';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,AgGridAngular,CommonModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit{
  overlayService = inject(OverlayService)
  contentService = inject(ContentService)
  commsService = inject(CommunicationService)
  onAddRole(){
    this.overlayService.open(CreateRoleComponent)
  }
  themeClass:string = 'ag-theme-quartz'
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 20, 50];
  rowData$ = new BehaviorSubject<any[]>([])

  colDefs:ColDef[]=[
    {field:"id", hide:true},
    {field:"role_name",headerName:"Role Name",flex:1},
    {field:"status",headerName:"Status",cellRenderer:RoleGridStatusComponent, cellRendererParams:{OnAction: this.updateStatus.bind(this) } , flex:1},
    {field:"doc",headerName:"Created At",flex:1},
    {field:"actions", cellRenderer:RoleGridActionsComponent, flex:1}
  ]
  constructor(){
    // this.gridComponent.selectedData$.subscribe(arg => this.selectedRecords = arg);
    this.commsService.currentChildData.subscribe(data =>{
      if (data==="UPDATE ROLE GRID"){
        console.log("updating grid");
        this.updateTableRows();
      }
    })
  }

  async ngOnInit() {
      this.updateTableRows()
  }

  async updateTableRows(){
    let rows = await this.contentService.getRoleInfo();
    this.rowData$.next(rows)
  }

  async updateStatus(rowData:any, active:boolean){
    const resp = await this.contentService.changeRoleStatus(rowData.id, active)
  }
  
}
