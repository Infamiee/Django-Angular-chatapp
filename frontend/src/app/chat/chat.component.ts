import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageResponse, Channel, UserFromToken } from 'stream-chat';
import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StreamService } from '../stream.service';
import { StateService, User } from '../state.service';

declare const feather: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})

export class ChatComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public streamService: StreamService,
    private stateService: StateService,
    private router: Router,
  ) {}

  messages: MessageResponse[] = [];
  message = '';
  channel: Channel;
  username = '';
  async sendMessage() {
    if (this.message) {
      try {
        await this.channel.sendMessage({
          text: this.message
        });
        this.message = '';
      } catch (err) {
        console.log(err);
      }
    }
  }


  getClasses(userId: string): { outgoing: boolean; incoming: boolean } {
    const userIdMatches = userId ===  this.streamService.chat.username;
    return {
      outgoing: userIdMatches,
      incoming: !userIdMatches,
    };
  }
  

  async ngOnInit() {
    feather.replace();
    
    if (this.stateService.chatInfo) {
      this.channel = await this.streamService.initClient(
        this.stateService.chatInfo
      );
      await this.channel.watch();
        this.messages = this.channel.state.messages as any;
        this.channel.on('message.new', (event) => {
          this.messages = this.messages.concat(event.message);
        });
        this.username = this.stateService.chatInfo.username;
      
    } else {
      this.router.navigate(['join']);
    }
    
  }
  async setupChat(){
    
  }


  
}