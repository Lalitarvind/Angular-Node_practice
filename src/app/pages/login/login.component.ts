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
    this.http.post("http://127.0.0.1:8080/auth/register",this.userRegisterObj).subscribe((res:any)=>{
      if (res.result){
        this.isLoginView=true
        alert("Registration Successful!")
      }else{
        alert(res.message)
      }
    })
  }

  onLogin(){
    this.http.post("http://127.0.0.1:8080/auth/login",this.userLoginObj).subscribe((res:any)=>{
      if (res.result){
        sessionStorage.setItem('angular18SessionAccess',res.data.access_token);
        this.router.navigateByUrl('dashboard')
      }
      else{
        alert(res.message)
      }
    })
  }
}
