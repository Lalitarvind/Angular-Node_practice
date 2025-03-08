import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GridRow } from '../interfaces';
import { OverlayService } from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  overlayService = inject(OverlayService)
  router = inject(Router)

  constructor() { }

  async fetchWithAuth(url:string, options:any = {}) {
    const access_token = sessionStorage.getItem('angular18SessionAccess');
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${access_token}`, 
    };
    let response = await fetch(url,{...options});
    if (response.status === 403) { // Token expired
        const refreshResponse = await fetch("http://127.0.0.1:8080/auth/refresh", { method: "POST", credentials: "include" });
        if (refreshResponse.ok) {
            console.log("im here")
            const { accessToken } = await refreshResponse.json();
            sessionStorage.setItem("angular18SessionAccess",accessToken)
            // Request with new token
            response = await fetch(url, {
                ...options,
                headers: { "Authorization": `Bearer ${accessToken}`}
            });
        }else{
            this.overlayService.close()
            this.router.navigateByUrl('login')
        }
    }
    return response.json();
  }

  async createRecord(formData:FormData){
    let options = {
      method:"POST",
      body: formData
    }
    const response = await this.fetchWithAuth("http://127.0.0.1:8080/test/create",options);
    return response
  }

  async updateRecord(rid:number,updates:FormData){
    let options = {
      method:"PATCH",
      body: updates
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/test/update/${rid}`,options);
    return response
  }

  async getVisibleRecords(){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth("http://127.0.0.1:8080/test/all",options);
    return response
  }

  async getRecordByID(id:number){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/test/one/${id}`,options);
    return response
  }

  async deleteRecord(updates:any){
    let options = {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/test/delete`,options)
    return response
  }

  async importRecords(formData:FormData){
    let options = {
      method:"POST",
      body: formData
    }
    const response = await this.fetchWithAuth('http://localhost:8080/test/upload',options)
    return response
  }
}
