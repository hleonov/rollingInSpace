import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatLogMessageDto, MessageSource } from '../models/dto/ChatLogMessageDto';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css'],
  providers: [WebsocketService],
})
export class ChatLogComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  
  messageLog: ChatLogMessageDto[] = [];  
  newmessage: string; 
  alias: string = '';
  showSystemMessages : boolean = true;
  userColor: string = '#2889e9'
  DEFAULT_COLOR : string = "rgb(255, 251, 0)"

  constructor(public webSocketService: WebsocketService) {}  
  
  ngOnInit() {    
    this.webSocketService.connect();  
    this.webSocketService.chatLogEVents$.subscribe( dto => {
      this.messageLog.push(dto);  
    })
  }  
  
  ngAfterViewChecked() {        
    this.scrollToBottom();        
   } 

   scrollToBottom(): void {
       try {
           this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
       } catch(err) { }
   }

  sendUserMessage() {    
    this.webSocketService.sendChatLogMessage({message: this.alias+": "+this.newmessage, 
                                              source: MessageSource.USER,
                                              color: this.userColor
                                            });
    this.newmessage = "";
  }  

  clearLog() {
    this.messageLog = []
  }

  toggleSystemMessages() {
    this.showSystemMessages = !this.showSystemMessages
  }

  itemShouldBeShown(source : MessageSource): boolean {
    return ( (source === MessageSource.USER) || (this.showSystemMessages))
  }

  getStyles(item : ChatLogMessageDto) {
    let styles : any = {};
    styles.color = (item.source === MessageSource.USER) ? item.color : this.DEFAULT_COLOR;
    return styles;
  }
  
}


