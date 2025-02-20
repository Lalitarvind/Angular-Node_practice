import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginView:boolean = true;

  userRegisterObj:any = {
    userName:'',
    password:'',
    emailId:''
  }

  userLoginObj:any = {
    emailId:'',
    password:''
  }

  router = inject(Router);
  http = inject(HttpClient);

  onRegister(){
    const isSessionData = sessionStorage.getItem("angular18Session");
    if (isSessionData!=null){
      const SessionArray = JSON.parse(isSessionData); 
      SessionArray.push(this.userRegisterObj);
      sessionStorage.setItem("angular18Session",JSON.stringify(SessionArray))
    }else{
      const SessionArray = []
      SessionArray.push(this.userRegisterObj)
      sessionStorage.setItem("angular18Session",JSON.stringify(SessionArray))
    }
    alert("Registration Success");
  }

  onLogin(){
    // const isSessionData = sessionStorage.getItem("angular18Session");
    // if(isSessionData!=null){
    //   const users = JSON.parse(isSessionData);
    //   const isUserFound = users.find((m:any)=> m.emailId == this.userLogin.emailId && m.password == this.userLogin.password)
    //   if(users!=undefined && isUserFound){
    //     this.router.navigateByUrl('dashboard')
    //   }else{
    //     alert("User name or password is wrong")
    //   }
    // }else{
    //   alert("No Users Found")
    // }
    // const isSessionAccess = sessionStorage.getItem("angular18SessionAccess");
    // const isSessionRefresh = sessionStorage.getItem("angular18SessionRefresh");
    this.http.post("http://Sessionhost:8080/auth/login",this.userLoginObj).subscribe((res:any)=>{
      if (res.result){
        alert("Login Success")
        sessionStorage.setItem('angular18SessionAccess',res.data.access_token);
        sessionStorage.setItem('angular18SessionRefresh',res.data.refresh_token);
        this.router.navigateByUrl('dashboard')
      }
      else{
        alert(res.message)
      }
    })
  }
}
