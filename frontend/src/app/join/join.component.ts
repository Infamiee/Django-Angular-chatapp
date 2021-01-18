import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { StateService, User } from '../state.service';
import { UserFromToken } from 'stream-chat';

declare const feather: any;


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
      var user:User;
      await this.login(this.username,this.password).subscribe((val)=>{
        this.stateService.user = val as User;
      },response=> {
          
        let res = response as HttpErrorResponse;
        console.log("POST call in error", res.error['message']);
        this.errorMessage = res.error['message'];
        this.isError=true;
    },)
    this.submitDisabled = false;
    this.registerText = 'Login';
      this.router.navigate(['']);
    }else{
      this.emptyFieldError()
    }
  }



  async onRegister() {
    if (this.username && this.password) {
      this.submitDisabled = true;
      this.registerText = 'Submitting...';
      await this.register(this.username,this.password).subscribe(
        (val) => {
            console.log("POST call successful value returned in body", 
                        val);
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
      this.emptyFieldError()
    }
  }
  private emptyFieldError(){
    this.errorMessage = "Fields cannot be empty"
    this.isError = true
  }
  public login(username: string,password:string){
    return this.http.post<User>('http://localhost:8000/login', { username,password})
  }
  public register(username: string,password:string){
    return this.http.post('http://localhost:8000/register', { username,password});
  }

  ngOnInit(): void {
    feather.replace();
  }
}