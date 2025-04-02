import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { RoleManagementComponent } from './pages/role-management/role-management.component';
import { MorderatorManagementComponent } from './pages/morderator-management/morderator-management.component';
import { ContentService } from './services/content.service';
import { Router, Routes } from '@angular/router';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export async function generateRoutes(router: Router, contentService: ContentService) {
    try {
        const rolesByModule: any = await contentService.getRolesByModules();

        const routes: Routes = [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'app',
                component: LayoutComponent,
                children: [
                    {
                        path: 'dashboard',
                        component: DashboardComponent,
                        canActivate: [AuthGuard],
                        data: { roles: rolesByModule?.['module1'] || [] }
                    },
                    {
                        path: 'role',
                        component: RoleManagementComponent,
                        canActivate: [AuthGuard],
                        data: { roles: rolesByModule?.['module2'] || [] }
                    },
                    {
                        path: 'moderator',
                        component: MorderatorManagementComponent,
                        canActivate: [AuthGuard],
                        data: { roles: rolesByModule?.['module3'] || [] }
                    },
                    {
                        path: 'unauthorized',
                        component: UnauthorizedComponent
                    }        
                ]
            }
        ];

        router.resetConfig(routes);
    } catch (error) {
        console.error('Error generating routes:', error);
    }
}
