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
  private _statsEvents: Subject<StatsDto> = new Subject();
  private _rollBoxEvents : Subject<RollInfoDto> = new Subject();

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
        _this.stompClient.subscribe('/topic/consume_stats', function (wsEvent :any) { //consume stats changes from backend (WS)
          _this.handleStatsEvent(wsEvent);
        });
        _this.stompClient.subscribe('/topic/consume_roll', function (wsEvent :any) { //consume roll info changes from backend (WS)
          _this.handleRollBoxEvent(wsEvent);
        });
      });
    }
  }
  public get statChangedEvents(): Observable<StatsDto> {
    return this._statsEvents.asObservable();
  }

  public get rollBoxChangedEvents() : Observable<RollInfoDto> {
    return this._rollBoxEvents.asObservable();
  }

  handleStatsEvent(wsEvent:any) {
      //console.log("consmued from websocket: "+wsEvent+"\n"+wsEvent.body);
      this._statsEvents.next(JSON.parse(wsEvent.body));
  }

  handleRollBoxEvent(wsEvent:any) {
    //console.log("consuming info from roll box: "+wsEvent+"\n"+wsEvent.body);
    this._rollBoxEvents.next(JSON.parse(wsEvent.body));
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

  // this sends the character stats back to the backend
  sendStatsDto(dto: StatsDto) {
    this.stompClient.send('/topic/stats',
      {}, JSON.stringify(dto));
  }

  //this sends the roll box information to the backend
  sendRollInfoDto(dto: RollInfoDto) {
    this.stompClient.send('/topic/roll',
    {}, JSON.stringify(dto));
  }

}