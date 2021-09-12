import { Injectable, EventEmitter, isDevMode } from "@angular/core";
import { Observable, Subject } from "rxjs"; 

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { RollInfoDto } from "../models/RollInfoDto";
import { StatsDto } from "../models/StatsDto";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  WS_URL : string = 'https://infinite-everglades-51264.herokuapp.com';

  stompClient: any;
  message : string;
  private _events: Subject<StatsDto> = new Subject();

  constructor() { 
    if (isDevMode()) {
      this.WS_URL = 'http://localhost:8080';
    }
    this.WS_URL += "/live";
  }

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
  public get events(): Observable<StatsDto> {
    return this._events.asObservable();
  }

  handleStatsEvent(wsEvent:any) {
      console.log("consmued from websocket: "+wsEvent+"\n"+wsEvent.body);
      this._events.next(JSON.parse(wsEvent.body));
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

  // this sends the character stats back to the backend, once the button is clicked
  sendStatsDto(dto: StatsDto) {
    this.stompClient.send('/topic/hello',
      {}, JSON.stringify(dto));
  }

}