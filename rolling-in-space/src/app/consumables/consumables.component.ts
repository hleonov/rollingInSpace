import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CharacterConsumables } from '../models/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';
import { MessageDto, WebsocketService } from "../services/websocket.service";
//import { UpdateService } from '../update.service';

@Component({
  selector: 'app-consumables',
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.css'],
  providers: [WebsocketService]
})
export class ConsumablesComponent implements OnInit {
  @Input() currentChar : CharacterConsumables;
  timesRested = new FormControl(1);

  constructor(private consumableService : ConsumablesService) {
    //,public webSocketService: WebsocketService) {
    //private updateService : UpdateService) { 
  }

  private msgDto : MessageDto = {
    id: 1,
    rested: 0
  };
  
  ngOnInit(): void {
  
    //this.webSocketService.connect();//openWebSocket();
      // this.webSocketService.getStompClient().connect({},  (frame : string) => {
      //   // _this.setConnected(true);
      //   console.log('Connected: ' + frame);
      //   this.webSocketService.getStompClient().subscribe('/topic/hi', function (hello: { body: string; }) {
      //     console.log(hello.body);  // this.showGreeting(JSON.parse(hello.body).greeting);
      //   });
      //   // this.webSocketService.getStompClient().subscribe('/topic/c/get', (data : any)=>  {
      //   //   console.log(data);
      //   //   this.charCons = data;
      //   // });
      // });
    
    // this.updateService.messages.subscribe(msg => {
    //   console.log("Response from websocket: " + msg);
    // });
  }

  ngOnDestroy(): void {
   //  this.webSocketService.disconnect();
  }

  inputChanged(index: number) : void {
    //this.sendMessage(new MessageDto(1,2));

    console.log("input changed for: "+this.currentChar.name);
   // console.log("new message from client to websocket: ", this.message);
   this.msgDto.id = index;
   this.msgDto.rested = this.timesRested.value;// this.charCons[index].timesRested.toString();
  // this.webSocketService.sendMessage(this.msgDto);
   // this.updateService.messages.next(this.message);
    console.log("times rested changed to: "+this.msgDto.rested);
    this.currentChar.timesRested = this.timesRested.value;
    //this.charCons[index]
    //this.charCons.find( c: (c.name == charConsum.name)
  }

  // sendMessage(sendForm: NgForm) {
  //   const chatMessageDto = new ChatMessageDto(sendForm.value.user, sendForm.value.message);
  //   this.webSocketService.sendMessage(chatMessageDto);
  //   sendForm.controls.message.reset();
  // }
  
  //  sendMessage(dto: MessageDto){
  //   this.webSocketService.getStompClient().send('/topic/hello',
  //   {}, "frontend test,, rested: "+dto.rested);
    //JSON.stringify(dto));  
 // }
  

}


