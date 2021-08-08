import { Injectable } from "@angular/core";
import { Observable, Observer, Subject } from "rxjs"; 
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { CharacterConsumables } from "../models/character-consumables";

export class MessageDto {
  id: number;
  rested : number;
  constructor(id: number, rested : number){
      this.id = id;
      this.rested = rested;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  WS_URL : string = 'http://localhost:8080/live';

  private stompClient: any;
  disabled = true;

  message : string;

  constructor() { }

  connect() {
    const socket = new SockJS(this.WS_URL);
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame: string) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      // _this.stompClient.subscribe('/topic/hi', function (hello: { body: string; }) {
      //   console.log(hello.body);
      // });
    });
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  public getStompClient() {
    return this.stompClient;
  }

  sendName() {
    this.stompClient.send(
      '/topic/hello',
      {},
      JSON.stringify({ 'name': 'Hadas' })
    );
  }

  showGreeting(message: string) {
    //this.greetings.push(message);
  }
}
  // USING websockets rxjs example
  // public openWebSocket(){
  //   this.webSocket = new WebSocket('ws://localhost:8080/live');

  //   this.webSocket.onopen = (event) => {
  //     console.log('Websocket Open: ', event);
  //   };

//     this.webSocket.onmessage = (event) => {
//       const chatMessageDto = JSON.parse(event.data);
//       this.message = chatMessageDto.message;
//       //this.chatMessages.push(chatMessageDto);
//     };

//     this.webSocket.onclose = (event) => {
//       console.log('Websocket Close: ', event);
//     };
//   }

//   public sendMessage(chatMessageDto: MessageDto){
//     this.webSocket.send(JSON.stringify(chatMessageDto));
//   }

//   public closeWebSocket() {
//     this.webSocket.close();
//   }
// }
  
//   private subject: Subject<MessageEvent> | undefined;

//   public connect(): Subject<MessageEvent> {
//     if (!this.subject) {
//       this.subject = this.create(this.url);
//       console.log("Successfully connected: " + this.url);
//     }
//     return this.subject;
//   }

//   private create(url : string): Subject<MessageEvent> {
//     let ws = new WebSocket(url);
    
//     let observable = Observable.create((obs: Observer<MessageEvent>) => {
//       ws.onmessage = obs.next.bind(obs);
//       ws.onerror = obs.error.bind(obs);
//       ws.onclose = obs.complete.bind(obs);
//       return ws.close.bind(ws);
//     });
//     let observer = {
//       next: (data: Object) => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify(data));
//         }
//       }
//     };
//     return Subject.create(observer, observable);
//   }
// }