import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { ChatInfo, StateService, User } from '../state.service';
import { UserFromToken } from 'stream-chat';
import { Observable } from 'rxjs';
declare const feather: any;
declare interface UserFromResponse {
  token: string;
  apiKey?: string;
  username: string;
  stream_token?:string;
}

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  
})
export class JoinComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private router: Router
  ) {}

  
  submitDisabled = false;
  username = '';
  password =''
  loginText = 'Login';
  registerText = 'Register'
  isError = false;
  errorMessage = '';
  async onLogin() {
    if (this.username && this.password) {
      this.submitDisabled = true;
      this.loginText = 'Submitting...';
      await this.login(this.username,this.password).subscribe(
        (val) => {
            const user:User = {username:val['data']['username'],token:val['data']['token']};
            this.stateService.user = user;
            this.setupStream()
            
      
        },
        response=> {
            var result = response as HttpErrorResponse;
            if(result.status == 403){
              this.displayError("User not found")
            }else if(result.status==500){
              this.displayError("Problems with authentication service")
            }
            else{
              this.displayError("Something went wrong")
            }
            
        },
        ()=>{

        });
    this.submitDisabled = false;
    this.loginText = 'Login';
    
    }else{
      this.displayError("Fields cannot be empty")
    }
  }



  async onRegister() {
    if (this.username && this.password) {
      this.submitDisabled = true;
      this.registerText = 'Submitting...';
      await this.register(this.username,this.password).subscribe(
        () => {
                        this.isError=false;
        },
        response=> {
          
            let res = response as HttpErrorResponse;
            console.log("POST call in error", res.error['message']);
            this.errorMessage = res.error['message'];
            this.isError=true;
        },
        );
      this.submitDisabled = false;
      this.registerText = 'Register';
    }else{
      this.displayError("Fields cannot be empty")
    }
  };

  async setupStream(){
      await this.getToken(this.stateService.user.token).subscribe(
        (val)=>{
          const chat:ChatInfo = {username:val['username'],apiKey:val['apiKey'],stream_token:val['token']}
          this.stateService.chatInfo = chat;
          this.router.navigate(['']);
        },
        ()=>{
          this.displayError("Couldn't create chat token")
        }
      )
  }

  private displayError(message:string){

    this.errorMessage = message
    this.isError = true
  }
  public login(username: string,password:string){
    return this.http.post('http://backend:8000/auth/login', { username,password})
  }
  public register(username: string,password:string){
    return this.http.post('http://backend:8000/auth/signup', { username,password});
  }
  public getToken(token:string){
    const requestOptions = {                                                                                                                                                                                 
     headers: new HttpHeaders({"Authorization":token}), 
   }; 
   return this.http.get('http://backend:8000/chat/token',requestOptions);
 }


  ngOnInit(): void {
    feather.replace();
  }
}