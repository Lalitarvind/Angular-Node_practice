import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import { ContentService } from '../../services/content.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommunicationService } from '../../services/communication.service';
import {module,permission} from '../../interfaces'
import { RoleDetailsFormComponent } from '../../supporting-components/role-details-form/role-details-form.component';


@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, RoleDetailsFormComponent],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css',
})

export class CreateRoleComponent implements OnInit{
  @ViewChild(RoleDetailsFormComponent) roleDetailForm!:RoleDetailsFormComponent
  overlayService = inject(OverlayService)
  contentService = inject(ContentService)
  commsService = inject(CommunicationService)
  module_permissions:module[]=[]
  form:FormGroup = new FormGroup({
    role_name: new FormControl('',[Validators.required]),
    modules: new FormArray<any>([])
  })

  async ngOnInit(){
    this.buildNestedCheckBox()
  }

  async buildNestedCheckBox(){
    let module_list = await this.contentService.getModules();
    for(let mod of module_list){
      let permissions = await this.contentService.getModuleActions(mod.module_id);
      // console.log('permissions:',permissions)
      let child_controls = new FormArray<FormControl<boolean>>([])
      let child_values:permission[]= []
      permissions.map((element:any) => {
        child_values.push({pid: element.permission_id, action: element.module_action, checked:false})
        let child_checked:FormControl = new FormControl<boolean>(false)
        
        child_controls.push(child_checked)
      });
      const temp_mod:module = {mid: mod.module_id, name: mod.module_name, permissions: child_values}
      this.module_permissions.push(temp_mod)
      let parentChecked = new FormControl<boolean>(false) 

      this.Modules.push(new FormGroup({
        checked: parentChecked,
        children: child_controls as FormArray
      }))
    }
  }

  get Modules(){
    return this.form.get('modules') as FormArray
  }

  onClose(){
    this.overlayService.close()
  }

  async onSubmit(){
    let permissions:number[] = this.roleDetailForm.getSelectedPermissions();
    let role_name = this.form.controls['role_name'].value

    const resp = await this.contentService.addRolePermissions(role_name,permissions);
    console.log("Add Role response:",resp)
    if ('error' in resp){
      alert("Role Name already exists!")
    }
    else{
      this.commsService.changeChildData("UPDATE ROLE GRID")
      this.overlayService.close()
    }
  }
}
