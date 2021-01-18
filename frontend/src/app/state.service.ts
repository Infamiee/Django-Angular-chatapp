import { Injectable } from '@angular/core';


export declare interface User {
  username:string
  token:string
}

export declare interface ChatInfo {
  username:string
  apiKey:string;
  stream_token:string;
}

@Injectable({
  providedIn: 'root',
})

export class StateService {
  constructor() {}

  private _user: User;
  private _chatInfo:ChatInfo;

  get chatInfo():ChatInfo{
    return this._chatInfo;
  }
  set chatInfo(chatInfo: ChatInfo) {
    this._chatInfo = chatInfo;
  }
  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }
}