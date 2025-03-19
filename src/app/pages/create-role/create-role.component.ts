import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import { ContentService } from '../../services/content.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

interface permission{
  pid: string,
  action: string,
  checked: boolean
}

interface module{
  mid: number,
  name: string,
  permissions: permission[]
}

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, MatCheckboxModule, MatFormFieldModule],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CreateRoleComponent implements OnInit{
  overlayService = inject(OverlayService)
  contentService = inject(ContentService)
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
      let permissions = await this.contentService.getModuleActions(mod);
      let child_controls = new FormArray<FormControl<boolean>>([])
      let child_values:permission[]= []
      permissions.map((element:any) => {
        child_values.push({pid: element.permission_id, action: element.module_action, checked:false})
        let child_checked:FormControl = new FormControl<boolean>(false)
        
        // child_checked.valueChanges.subscribe(value=>{
        //   let formgrp:FormGroup = child_checked.parent?.parent as FormGroup
        //   this.updateParent(formgrp)
        // })
        
        child_controls.push(child_checked)
      });
      const temp_mod:module = {mid: mod.module_id, name: mod.module_name, permissions: child_values}
      this.module_permissions.push(temp_mod)
      let parentChecked = new FormControl<boolean>(false)
      
      // parentChecked.valueChanges.subscribe((value:boolean|null)=>{
      //   if (value!=null){
      //     let formgrp:FormGroup = parentChecked.parent as FormGroup
      //     this.updateChildren(formgrp,value)
      //   }
      // })
      

      this.Modules.push(new FormGroup({
        checked: parentChecked,
        children: child_controls as FormArray
      }))
    }
  }

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
      child.setValue(event.value,{ emitEvent: false })
      this.module_permissions[formgrp_ind].permissions[index].checked = event.value
    }
  }

  get Modules(){
    return this.form.get('modules') as FormArray
  }

  getFormArray(ind:number){
    return this.Modules.at(ind).get('children') as FormArray
  }

  onClose(){
    this.overlayService.close()
  }

  onSubmit(){
    
  }
}
