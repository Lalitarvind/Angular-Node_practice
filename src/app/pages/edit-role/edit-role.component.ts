import {
  Component,
  Inject,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommunicationService } from '../../services/communication.service';
import { ContentService } from '../../services/content.service';
import { OverlayService } from '../../services/overlay.service';
import { RoleDetailsFormComponent } from '../../supporting-components/role-details-form/role-details-form.component';
import { module, permission } from '../../interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    RoleDetailsFormComponent,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.css',
})
export class EditRoleComponent implements OnInit {
  @ViewChild(RoleDetailsFormComponent)
  roleDetailForm!: RoleDetailsFormComponent;
  role_info!: any;
  overlayService = inject(OverlayService);
  contentService = inject(ContentService);
  commsService = inject(CommunicationService);
  role_permissions!: number[];
  module_permissions: module[] = [];
  form: FormGroup = new FormGroup({
    role_name: new FormControl([
      { value: '', disabled: true },
      Validators.required,
    ]),
    modules: new FormArray<any>([]),
  });

  constructor(@Inject('overlayData') data: any) {
    this.role_info = data;
    this.form.get('role_name')?.setValue(this.role_info.role_name);
  }

  async ngOnInit() {
    this.role_permissions = await this.contentService.getRolePermissionIds(
      this.role_info.role_id
    );
    // console.log(this.role_permissions)
    this.buildNestedCheckBox();
  }

  async buildNestedCheckBox() {
    let module_list = await this.contentService.getModules();
    for (let mod of module_list) {
      let permissions = await this.contentService.getModuleActions(
        mod.module_id
      );
      // console.log('module permissions:',permissions)
      let child_controls = new FormArray<FormControl<boolean>>([]);
      let child_values: permission[] = [];
      let isModuleChecked = false;
      permissions.forEach((element: any) => {
        let isActionChecked = false;
        if (this.role_permissions.includes(element.permission_id)) {
          isActionChecked = true;
          isModuleChecked = true;
        }
        child_values.push({
          pid: element.permission_id,
          action: element.module_action,
          checked: isActionChecked,
        });
        let child_checked: FormControl = new FormControl<boolean>(
          isActionChecked
        );

        child_controls.push(child_checked);
      });
      const temp_mod: module = {
        mid: mod.module_id,
        name: mod.module_name,
        permissions: child_values,
      };
      this.module_permissions.push(temp_mod);
      let parentChecked = new FormControl<boolean>(isModuleChecked);

      this.Modules.push(
        new FormGroup({
          checked: parentChecked,
          children: child_controls as FormArray,
        })
      );
    }
  }

  get Modules() {
    return this.form.get('modules') as FormArray;
  }

  onClose() {
    this.overlayService.close();
  }

  async onSubmit() {
    let permissions: number[] = this.roleDetailForm.getSelectedPermissions();
    const resp = await this.contentService.editRolePermissions(
      this.role_info.role_id,
      permissions
    );
    console.log('Edit Role response:', resp);
    if ('error' in resp) {
      alert(JSON.stringify(resp));
    } else {
      this.commsService.changeChildData('UPDATE ROLE GRID');
      this.overlayService.close();
    }
  }
}
