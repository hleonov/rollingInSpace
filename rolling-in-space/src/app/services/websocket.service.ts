import { Injectable, EventEmitter } from "@angular/core";
import { Observable, Subject } from "rxjs"; 

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export class MessageDto {
  name: string;
  mightMax: number;
  mightCur : number;
  constructor(name: string, mightMax: number, mightCur : number){
      this.name = name;
      this.mightMax = mightMax;
      this.mightCur = mightCur;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  WS_URL : string = 'http://localhost:8080/live';

  stompClient: any;
  message : string;
  eventEmitter: EventEmitter<MessageDto> = new EventEmitter<MessageDto>();
  private _events: Subject<MessageDto> = new Subject();

  constructor() { }

  connect() {
    if (this.stompClient == null) {
      let webSocket = new SockJS(this.WS_URL);
      this.stompClient = Stomp.over(webSocket);
      const _this = this;
      this.stompClient.connect({}, function (frame : any) {
        console.log('Connected inside Websocket service: ' + frame);
        _this.stompClient.subscribe('/topic/hi', function (wsEvent :any) {
          _this.handleStatsEvent(wsEvent);
        });
      });
    }
  }
  public get events(): Observable<MessageDto> {
    return this._events.asObservable();
  }

  handleStatsEvent(wsEvent:any) {
      console.log("consmued from websocket: "+wsEvent+"\n"+wsEvent.body);
      this._events.next(new MessageDto('Tobi', 1, 1));
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected!');
  }

  public getStompClient() {
    while (this.stompClient == null) {
      this.connect();
    }
    return this.stompClient;
  }

  // this sends a message back to the backend, once the button is clicked.
   //entire consumablesDTO sent through the websocket?
   sendMessage(dto: MessageDto){
    this.stompClient.send('/topic/hello',
    {}, "in sendMessage, for <"+dto.name+">, might: "+dto.mightMax + "\t"+dto.mightCur);
   }

  sendName() {
    this.stompClient.send(
      '/topic/hello',
      {},
      JSON.stringify({ 'name': 'Hadas' })
    );
  }

}