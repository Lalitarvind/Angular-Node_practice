import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const sessionAccess = sessionStorage.getItem('angular18SessionAccess');
  const router = inject(Router);

  if (sessionAccess==null){
    router.navigateByUrl("login")
    return false
  }else{
    return true;
  }
};
