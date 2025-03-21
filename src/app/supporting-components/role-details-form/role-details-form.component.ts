import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {module,permission} from '../../interfaces'
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-role-details-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatCheckboxModule],
  templateUrl: './role-details-form.component.html',
  styleUrl: './role-details-form.component.css'
})
export class RoleDetailsFormComponent {
  @Input({required:true}) module_permissions!:module[];
  @Input({required:true}) form!:FormGroup;
  

  onChildChange(event:any, formgrp_ind:number, control_ind:number){
    let formgrp = this.Modules.at(formgrp_ind) as FormGroup
    const children  = formgrp.get('children') as FormArray
    this.module_permissions[formgrp_ind].permissions[control_ind].checked = event.value
    let selected = false
    for(const child of children.controls){
      if (child.value==true){
        selected = true
      }
    }
    formgrp.get('checked')?.setValue(selected,{ emitEvent: false })
  }

  onParentChange(event:any,formgrp_ind:number){
    let formgrp = this.Modules.at(formgrp_ind) as FormGroup
    const children = formgrp.get('children') as FormArray
    for (const [index,child] of children.controls.entries()){
      child.setValue(event.checked,{ emitEvent: false })
      this.module_permissions[formgrp_ind].permissions[index].checked = event.checked
    }
  }
    get Modules(){
        return this.form.get('modules') as FormArray
      }
  
    getFormArray(ind:number){
      return this.Modules.at(ind).get('children') as FormArray
    }

    getSelectedPermissions(){
      let permissions = []
      for( let module of this.module_permissions){
        for(let permission of module.permissions){
          if (permission.checked){
            permissions.push(permission.pid)
          }
        }
      }
      return permissions
    }
}
