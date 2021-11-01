import { Injectable, isDevMode } from "@angular/core";
import { Observable, Subject } from "rxjs"; 
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PlayerRollInfoDto } from "../models/dto/RollInfoDto";
import { StatsDto } from "../models/dto/StatsDto";
import { GmRollInfoDto } from "../models/dto/GmRollInfoDto";
import { ChatLogMessageDto } from "../models/dto/ChatLogMessageDto";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  WS_URL : string = 'https://infinite-everglades-51264.herokuapp.com';

  stompClient: any;
  message : string;
  private _statsEvents: Subject<StatsDto> = new Subject();
  private _playerRollInfoEvents : Subject<PlayerRollInfoDto> = new Subject();
  private _gmInfoEvents : Subject<GmRollInfoDto> = new Subject();
  private _chatlogEvents : Subject<ChatLogMessageDto> = new Subject();
  
  statsEvents$ : Observable<StatsDto> = this._statsEvents.asObservable();
  playerRollEvents$ : Observable<PlayerRollInfoDto> = this._playerRollInfoEvents.asObservable();
  gmEvents$ : Observable<GmRollInfoDto> = this._gmInfoEvents.asObservable();
  chatLogEVents$ : Observable<ChatLogMessageDto> = this._chatlogEvents.asObservable();

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
          _this._statsEvents.next(JSON.parse(wsEvent.body));
        });
        _this.stompClient.subscribe('/topic/consume_roll', function (wsEvent :any) { //consume player roll info changes from backend (WS)
          _this._playerRollInfoEvents.next(JSON.parse(wsEvent.body));
        });
        _this.stompClient.subscribe('/topic/consume_gminfo', function (wsEvent :any) { //consume gm roll info changes from backend (WS)
          _this._gmInfoEvents.next(JSON.parse(wsEvent.body));
        });
        _this.stompClient.subscribe('/topic/consume_chatlog', function(wsEvent :any){ //consume chatlog from backend (WS)
          _this._chatlogEvents.next(JSON.parse(wsEvent.body));
        });
      });
    }
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

  // sends the character stats back to the backend
  sendStatsDto(dto: StatsDto) {
    this.stompClient.send('/topic/stats',
      {}, JSON.stringify(dto));
  }

  // sends the player roll dto to the backend
  sendRollInfoDto(dto: PlayerRollInfoDto) {
    this.stompClient.send('/topic/roll',
    {}, JSON.stringify(dto));
  }

  // sends the gm roll dto to the backend
  sendGmRollInfoDto(dto: GmRollInfoDto) {
      this.stompClient.send('/topic/gminfo',
      {}, JSON.stringify(dto));
  }

  //send message into chat log
  sendChatLogMessage(dto : ChatLogMessageDto) {
    this.stompClient.send('/topic/chatlog',
    {},
    JSON.stringify(dto));
  }
}