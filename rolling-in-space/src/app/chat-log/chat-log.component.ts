import { Component, OnInit } from '@angular/core';
import { ChatLogMessageDto, MessageSource } from '../models/dto/ChatLogMessageDto';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css'],
  providers: [WebsocketService],
})
export class ChatLogComponent implements OnInit {

  messageLog: ChatLogMessageDto[] = [];  
  newmessage: string; 
  alias: string = '';
  showSystemMessages : boolean = true;

  constructor(public webSocketService: WebsocketService) {}  
  
  ngOnInit() {    
    this.webSocketService.connect();  
    this.webSocketService.chatLogEVents$.subscribe( dto => {
      this.storeMessage(dto);
    })
  }  
  
  sendUserMessage() {    
    this.webSocketService.sendChatLogMessage({message: this.alias+": "+this.newmessage, 
                                              source: MessageSource.USER});
    this.newmessage = "";
  }  
  
  storeMessage(dto : ChatLogMessageDto) {
     this.messageLog.push(dto);  
  }

  clearLog() {
    this.messageLog = []
  }

  toggleSystemMessages() {
    this.showSystemMessages = !this.showSystemMessages
  }

  shouldBeShown(source : MessageSource): boolean {
    return ( (source === MessageSource.USER) || (this.showSystemMessages))
  }

  getCssClass(source : MessageSource) {
    return [source.toString()]
  }
}
