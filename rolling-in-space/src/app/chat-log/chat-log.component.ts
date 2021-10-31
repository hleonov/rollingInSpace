import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css'],
  providers: [WebsocketService],
})
export class ChatLogComponent implements OnInit {

  messageLog: string[] = [];  
  newmessage: string; 
    
  constructor(public webSocketService: WebsocketService) {}  
  
  ngOnInit() {    
    this.webSocketService.connect();  
    this.webSocketService.chatLogEvents.subscribe( message => {
      this.showMessage(message);
    })
  }  
  
  sendMessage() {    
    this.webSocketService.sendChatMessage(this.newmessage);
    this.newmessage = "";  
  }  
  
  showMessage(message : string) {
    console.log("this was my message: ",message)
     this.messageLog.push(message);  
  }

}
