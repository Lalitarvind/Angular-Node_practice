import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginView:boolean = true;
  authService = inject(AuthService)
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
    this.authService.login(this.userLoginObj.emailId,this.userLoginObj.password)
  }
}
