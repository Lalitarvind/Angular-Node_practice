import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const access_token = sessionStorage.getItem('angular18SessionAccess');
  const clonedReq = req.clone({
    setHeaders:{
      "Authorization":`Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  })
  return next(clonedReq);
};
