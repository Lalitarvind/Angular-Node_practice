import { Component,inject,ViewChild } from '@angular/core';
import { GridComponent } from "../../supporting-components/grid/grid.component";
import { MatIconModule } from '@angular/material/icon';
import { OverlayService } from '../../services/overlay.service';
import { AddRecordComponent } from '../add-record/add-record.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { CommunicationService } from '../../services/communication.service';
import { ExportDialogComponent } from '../../supporting-components/export-dialog/export-dialog.component';
import { ImportDialogComponent } from '../../supporting-components/import-dialog/import-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ GridComponent, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent {
  @ViewChild(GridComponent) gridComponent!:GridComponent;
  commsService = inject(CommunicationService)
  overlayService = inject(OverlayService)
  selectedRecords:any[] = []
  constructor(){
    // this.gridComponent.selectedData$.subscribe(arg => this.selectedRecords = arg);
    this.commsService.currentChildData.subscribe(data =>{
      if (data==="UPDATE GRID"){
        console.log("updating grid");
        this.gridComponent.updateTableRows();
      }
    })
  }
  onAddRecord(){
    this.overlayService.open(AddRecordComponent)
  }

  onImportRecords(){
    this.overlayService.open(ImportDialogComponent)
  }

  onExportRecords(){
    this.gridComponent.rowData$.subscribe(objarr =>{
      this.overlayService.open(ExportDialogComponent,objarr)
    })
  }
  
  onDeleteRecords(){
    // const message = "Confirm Deletion of selected records?"
    // this.gridComponent.selectedData$.subscribe(data=>{
    //   this.overlayService.open(DeletePopupComponent,{deleteMessage:message,rids:data})
    // })
  }

}
