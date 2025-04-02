import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';
import { ContentService } from '../../services/content.service';
import { OverlayService } from '../../services/overlay.service';
import { RoleGridActionsComponent } from '../../supporting-components/role-grid-actions/role-grid-actions.component';
import { RoleGridStatusComponent } from '../../supporting-components/role-grid-status/role-grid-status.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { CreateMorderatorComponent } from '../create-morderator/create-morderator.component';

@Component({
  selector: 'app-morderator-management',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,AgGridAngular,CommonModule],
  templateUrl: './morderator-management.component.html',
  styleUrl: './morderator-management.component.css'
})
export class MorderatorManagementComponent implements OnInit{
  overlayService = inject(OverlayService)
  contentService = inject(ContentService)
  commsService = inject(CommunicationService)

  themeClass:string = 'ag-theme-quartz'
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 20, 50];
  rowData$ = new BehaviorSubject<any[]>([])

  colDefs:ColDef[]=[
    {field:"user_id", hide:true},
    {field:"user_name",headerName:"Username",flex:1},
    {field:"email",headerName:"Email",flex:1},
    {field:"role_id",hide:true},
    {field:"role_name",headerName:"Role",flex:1},
    {field:"phone_number",hide:true},
    {field:"status",headerName:"Status",cellRenderer:RoleGridStatusComponent , cellRendererParams:{OnAction: this.updateStatus.bind(this)}, flex:1},
    {field:"last_login",headerName:"Last Login",flex:1},
    {field:"actions", cellRenderer:RoleGridActionsComponent, cellRendererParams:{actions:{edit:this.editUser.bind(this),delete:this.deleteUser.bind(this)}}, flex:1}
  ]
  constructor(){
    // this.gridComponent.selectedData$.subscribe(arg => this.selectedRecords = arg);
    this.commsService.currentChildData.subscribe(data =>{
      if (data==="UPDATE MORDERATOR GRID"){
        console.log("updating grid");
        this.updateTableRows();
      }
    })
  }

  async ngOnInit() {
      this.updateTableRows()
  }

  async updateTableRows(){
    let rows = await this.contentService.getRoleUsers();
    this.rowData$.next(rows)
  }

  onAddRole(){
    this.overlayService.open(CreateMorderatorComponent)
  }

  async updateStatus(rowData:any, active:boolean){
    const resp = await this.contentService.updateUserStatus(rowData.user_id, active)
  }

  async editUser(rowData:any){
    this.overlayService.open(EditUserComponent,{user_id: rowData.user_id})
  }
  
  async deleteUser(rowData:any){
    this.overlayService.open(DeletePopupComponent,{rids: [rowData.id], delete_message:`Confirm delete of record '${rowData.first_name} ${rowData.last_name}'`})
  }
}
