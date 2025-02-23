import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // For sending data from parent to child
  private parentDataSource = new Subject<any>();
  currentParentData = this.parentDataSource.asObservable();

  // For sending data from child to parent
  private childDataSource = new Subject<any>();
  currentChildData = this.childDataSource.asObservable();
  
  changeParentData(data: any) {
    this.parentDataSource.next(data);
  }

  changeChildData(data: any) {
    this.childDataSource.next(data);
  }
}
