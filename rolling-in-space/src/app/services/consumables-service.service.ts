import { Injectable, isDevMode} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CharacterConsumables } from '../models/character-consumables';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumablesService {

  private REST_API_SERVER = "https://infinite-everglades-51264.herokuapp.com";
  private countEndpoint = "/count"
  private charConsumablesEndpoint = "/c"

  public characterConsumables: Subject<CharacterConsumables[]>;
  
  constructor(private httpClient: HttpClient, private wsService: WebsocketService) {
    if (isDevMode()) {
      this.REST_API_SERVER = "http://localhost:8080/";
      console.log(this.REST_API_SERVER);
    }
  }

  //TODO move this away from here
  getServerEndpoint() {
    return this.REST_API_SERVER;
  }
  // public getCharConsumableById(id: number){
  //   return this.httpClient.get(this.REST_API_SERVER);
  // }
  getCharacterConsumables() : Observable<any>{
    return this.httpClient.get<CharacterConsumables[]>(this.REST_API_SERVER+this.charConsumablesEndpoint)
       .pipe(catchError(() => of([])))
      //{observe: 'response'}); 
  }

  // getCharacterConsumablesWS() : Subject<any>{    
  //   this.characterConsumables = <Subject<CharacterConsumables[]>>this.wsService.openWebSocket()
  //   .pipe(map(
  //     (response: MessageEvent): Message => {
  //       let data = JSON.parse(response.data);
  //       return {
  //         message: data.message
  //       };
  //     }))
  // }

  //   return this.httpClient.get<CharacterConsumables[]>(this.REST_API_SERVER+this.charConsumablesEndpoint)
  //      .pipe(catchError(() => of([])))
  //     //{observe: 'response'}); 
  // }

  getSizeOfRepo() : Observable<any> {
    return this.httpClient.get(this.REST_API_SERVER+this.countEndpoint)
  }

  // @Injectable()
// export class UpdateService {
//   public messages: Subject<Message>;

//   constructor(wsService: WebsocketService) {
//     this.messages = <Subject<Message>>wsService.connect(CHAT_URL)
//     .pipe(map(
//       (response: MessageEvent): Message => {
//         let data = JSON.parse(response.data);
//         return {
//           message: data.message
//         };
//       }))
//   }
// }
}
