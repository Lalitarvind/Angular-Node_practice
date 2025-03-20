import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { RoleManagementComponent } from './pages/role-management/role-management.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',
        component: LayoutComponent,
        children: [
            {
                path:'dashboard',
                component:DashboardComponent,
                canActivate:[authGuard]
            },
            {
                path:'role',
                component:RoleManagementComponent,
                canActivate:[authGuard]
            }
        ]
    }
];
