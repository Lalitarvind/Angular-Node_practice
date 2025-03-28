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

  async getCountryOptions(){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/test/countries`,options);
    return response
  }

  async getStateOptions(country_code:string){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/test/states/${country_code}`,options);
    return response
  }

  async getModules(){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth('http://127.0.0.1:8080/roles/list_modules',options);
    return response
  }

  async getModuleActions(module:Number){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/roles/module/actions/${module}`,options);
    return response
  }

  async addRolePermissions(role_name:string, permissions:number[]){
    let request_body = {
      permissions: permissions,
      role_name: role_name
    }

    let options = {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    }
    const response = await this.fetchWithAuth('http://127.0.0.1:8080/roles/add',options);
    return response
  }

  async getRoleInfo(){
    let options = {
      method:"GET"
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/roles/list_roles`,options);
    return response
  }

  async changeRoleStatus(rid:number, status:boolean){
    let request_body = {
      role_id: rid,
      status: status
    }

    let options = {
      method:"POST",
      headers:{
        "Content-Type":'application/json'
      },
      body: JSON.stringify(request_body)
    }

    const response = await this.fetchWithAuth('http://127.0.0.1:8080/roles/change_status',options)
    return response
  }

  async getRolePermissions(rid:number){
    let options = {
      method: "GET"
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/roles/get_role_permissions/${rid}`,options)
    return response
  }

  async deleteRole(rid:number){
    let options = {
      method:'GET'
    }
    const response = await this.fetchWithAuth(`http://127.0.0.1:8080/roles/change_visibility/${rid}`,options)
    return response
  }

  async editRolePermissions(rid:number, permissionIds:number[]){
    let request_body = {
      role_id: rid,
      permissionIds: permissionIds
    }

    let options = {
      method:"POST",
      headers:{
        "Content-Type":'application/json'
      },
      body: JSON.stringify(request_body)
    }

    const response = await this.fetchWithAuth('http://127.0.0.1:8080/roles/modify_permissions',options)
    return response
  }
}
