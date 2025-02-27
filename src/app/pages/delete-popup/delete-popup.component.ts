import { Component, Inject, inject } from '@angular/core';
import { OverlayService } from '../../services/overlay.service';
import { ContentService } from '../../services/content.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.css'
})
export class DeletePopupComponent {
  private overlayService = inject(OverlayService);
  contentService = inject(ContentService)
  commsService = inject(CommunicationService)
  deleteMessage!:string;
  rids!:number[];
  constructor(@Inject("overlayData") data: any){
    this.deleteMessage = data.delete_message;
    this.rids = data.rids;
  }
  onCancel(){
    this.overlayService.close();
  } 
  onDelete(){
    this.contentService.deleteRecord({rids: this.rids})
    this.commsService.changeChildData("UPDATE GRID")
    this.overlayService.close();
  }
}
