import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const access_token = localStorage.getItem('angular18LocalAccess');
  const clonedReq = req.clone({
    setHeaders:{
      "Authorization":`Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  })
  return next(clonedReq);
};
