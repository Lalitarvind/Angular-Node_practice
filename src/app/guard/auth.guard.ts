// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';


// export const authGuard: CanActivateFn = (route, state) => {
//   const sessionAccess = sessionStorage.getItem('angular18SessionAccess');
//   const router = inject(Router);

//   if (sessionAccess==null){
//     router.navigateByUrl("login")
//     return false
//   }else{
//     console.log("Session variable not found")
//     return true;
//   }

// };
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const sessionAccess = sessionStorage.getItem('angular18SessionAccess');
    if (sessionAccess==null){
          this.router.navigateByUrl("login")
          return false
        }
    const requiredRoles = route.data['roles'] as string[];
    if (await this.authService.isAuthorized(requiredRoles)) {
      return true;
    }
    this.router.navigate(['app/unauthorized']);
    return false;
  }
}
