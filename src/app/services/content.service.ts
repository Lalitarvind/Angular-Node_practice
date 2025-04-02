import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayService } from './overlay.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  overlayService = inject(OverlayService);
  router = inject(Router);

  constructor() {}

  async fetchWithAuth(url: string, options: any = {}) {
    const access_token = sessionStorage.getItem('angular18SessionAccess');
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${access_token}`,
    };
    let response = await fetch(url, { ...options });
    if (response.status === 403) {
      // Token expired
      const refreshResponse = await fetch(
        'http://127.0.0.1:8080/auth/refresh',
        { method: 'POST', credentials: 'include' }
      );
      if (refreshResponse.ok) {
        console.log('im here');
        const { accessToken } = await refreshResponse.json();
        sessionStorage.setItem('angular18SessionAccess', accessToken);
        // Request with new token
        response = await fetch(url, {
          ...options,
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        this.overlayService.close();
        this.router.navigateByUrl('login');
      }
    }
    return response.json();
  }

  async createRecord(formData: FormData) {
    let options = {
      method: 'POST',
      body: formData,
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/test/create',
      options
    );
    return response;
  }

  async updateRecord(rid: number, updates: FormData) {
    let options = {
      method: 'PATCH',
      body: updates,
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/test/update/${rid}`,
      options
    );
    return response;
  }

  async getVisibleRecords() {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/test/all',
      options
    );
    return response;
  }

  async getRecordByID(id: number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/test/one/${id}`,
      options
    );
    return response;
  }

  async deleteRecord(updates: any) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/test/delete`,
      options
    );
    return response;
  }

  async importRecords(formData: FormData) {
    let options = {
      method: 'POST',
      body: formData,
    };
    const response = await this.fetchWithAuth(
      'http://localhost:8080/test/upload',
      options
    );
    return response;
  }

  async getCountryOptions() {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/test/countries`,
      options
    );
    return response;
  }

  async getStateOptions(country_code: string) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/test/states/${country_code}`,
      options
    );
    return response;
  }

  async getModules() {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/list_modules',
      options
    );
    return response;
  }

  async getModuleActions(module: Number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/module/actions/${module}`,
      options
    );
    return response;
  }

  async addRolePermissions(role_name: string, permissions: number[]) {
    let request_body = {
      permissions: permissions,
      role_name: role_name,
    };

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request_body),
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/add',
      options
    );
    return response;
  }

  async getRoleInfo() {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/list_roles`,
      options
    );
    return response;
  }

  async getRolesByModules(){
    let options = {
      method: 'GET',
    };
    const response:{name:string, roles:string[]}[] = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/get_roles_by_modules`,
      options
    );
    let result:{[index:string]:any} = {}
    for (let item of response){
      let name:string = item.name;
      let roles = item.roles;
      result[name] = roles
    }
    // response.forEach((item:{name:string, roles:string[]})=>{result[item.name] = item.roles});
    return result;
  }

  async changeRoleStatus(rid: number, status: boolean) {
    let request_body = {
      role_id: rid,
      status: status,
    };

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request_body),
    };

    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/change_status',
      options
    );
    return response;
  }

  async getRolePermissionIds(rid: number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/get_role_permission_ids/${rid}`,
      options
    );
    return response;
  }

  async getRoleName(rid: number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/get_role_name/${rid}`,
      options
    );
    return response;
  }

  async getRolePermissionNames(rid: number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/get_role_permission_names/${rid}`,
      options
    );
    return response;
  }

  async deleteRole(rid: number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/change_visibility/${rid}`,
      options
    );
    return response;
  }

  async editRolePermissions(rid: number, permissionIds: number[]) {
    let request_body = {
      role_id: rid,
      permissionIds: permissionIds,
    };

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request_body),
    };

    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/modify_permissions',
      options
    );
    return response;
  }

  async getRoleUsers() {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/users/list',
      options
    );
    return response;
  }

  async createMorderator(req_body: any) {
    // const req_body = {
    //   first_name: fname,
    //   last_name: lname,
    //   user_name: uname,
    //   email: email,
    //   password: pass,
    //   role_id: rid
    // }

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_body),
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/users/create',
      options
    );
    return response;
  }

  async updateUserStatus(uid: number, status: boolean) {
    const req_body = {
      user_id: uid,
      status: status,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_body),
    };
    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/users/change_status',
      options
    );
    return response;
  }

  async updateUserVisibility(uid: number) {
    let options = {
      method: 'DELETE',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/users/delete/${uid}`,
      options
    );
    return response;
  }

  async getUserById(uid: number) {
    let options = {
      method: 'GET',
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/users/get_user_details/${uid}`,
      options
    );
    return response;
  }

  async updateUser(user_id: number, updated_values: any) {
    let options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updated_values),
    };
    const response = await this.fetchWithAuth(
      `http://127.0.0.1:8080/roles/users/update/${user_id}`,
      options
    );
    return response;
  }

  async resetPassword(user_id: number, password: string) {
    const req_body = {
      user_id: user_id,
      password: password,
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_body),
    };

    const response = await this.fetchWithAuth(
      'http://127.0.0.1:8080/roles/users/reset_password',
      options
    );
    return response;
  }
}
