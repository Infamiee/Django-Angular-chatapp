import { Injectable } from '@angular/core';
import { StreamChat, Channel, ConnectAPIResponse } from 'stream-chat';

declare interface Chat {
  username:string
  apiKey:string;
  stream_token:string;
}


@Injectable({
  providedIn: 'root',
})

export class StreamService {
  constructor() {}
  streamClient: StreamChat;
  currentUser: ConnectAPIResponse;
  chat: Chat;
  
  public async initClient(chat: Chat): Promise<Channel> {
    this.chat=chat;
    console.log(chat.apiKey)
    this.streamClient = new StreamChat(chat.apiKey);
    this.streamClient.connectUser(
      {
        id: chat.username,
        name: chat.username,
      },
      chat.stream_token
    );
    return this.streamClient.channel('messaging', 'General');
  }
}