import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  http = inject(HttpClient);
  contentService =  inject(ContentService)
  constructor() { }

  login(email:string,password:string){
    const userLoginObj:any = {
      emailId:email,
      password:password
    }
    this.http.post("http://127.0.0.1:8080/auth/login",userLoginObj).subscribe(async (res:any)=>{
      if (res.result){
        console.log("Login Response object:", res)
        sessionStorage.setItem('angular18SessionAccess',res.data.access_token);
        const roleID = res.data.roleId
        const username = res.data.userName   
        localStorage.setItem('UserRoleId', roleID);
        this.router.navigateByUrl('app/dashboard')
      }
      else{
        alert(res.message)
      }
    })
  }

  async isAuthorized(requiredRoles:string[]){
    const roleID = Number(localStorage.getItem('UserRoleId'));
    const role_name = await this.contentService.getRoleName(roleID) || 'Default_Viewer_Role'
    return requiredRoles.includes(role_name)
  }

  async hasPermission(permission:string){
    const roleID = Number(localStorage.getItem('UserRoleId'));
    const permission_names = await this.contentService.getRolePermissionNames(roleID)
    return permission_names.include(permission)
  }
}
