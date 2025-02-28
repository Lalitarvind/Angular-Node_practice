import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import {MatRadioModule} from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatRadioModule,MatButtonModule],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {
  overlayService = inject(OverlayService)
  records!:any[]
  constructor(@Inject("overlayData") data:any){
    this.records = data
  }

  form:FormGroup = new FormGroup({
    download_option:new FormControl('',[Validators.required])
  })


  ConvertToCSV(objArray:any[], headerList:string[]) {
    let array = typeof objArray !=
        'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
        row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i + 1) + '';
        for (let index in headerList) {
            let head = headerList[index];
            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
  }

  DownloadToCSV(data:any[]){
    const filename = "profile_records"
    let csvData = this.ConvertToCSV(data,
      ['first_name', 
       'last_name',
       'email', 
       'phone', 
       'gender',
       'dob']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData],
        { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') !=
        -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {

        // If Safari open in new window to
        // save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  DownloadToPDF(data:any){
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('User Profile Data', 10, 10);

    const tableData = data.map((item:any)=> [item.first_name, item.last_name, item.email, item.phone, item.gender, new Date(item.dob).toISOString().split('T')[0]]);
  
    autoTable(doc, {
      head: [['First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Date of Birth']],
      body: tableData,
      startY: 20
    });

    doc.save('ProfileData.pdf');
  }
  onSubmit(){
    if(this.form.value['download_option']=="pdf"){
      this.DownloadToPDF(this.records)
    } else{
      this.DownloadToCSV(this.records);
    }
    this.overlayService.close()
  }

  onClose(){
    this.overlayService.close()
  }

}

