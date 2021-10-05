import { Injectable, isDevMode} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CharacterConsumables } from '../models/entity/character-consumables';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { StatsDto } from '../models/dto/StatsDto';

@Injectable({
  providedIn: 'root'
})
export class ConsumablesService {

  private REST_API_SERVER = "https://infinite-everglades-51264.herokuapp.com";
  private countEndpoint = "/count"
  private charConsumablesEndpoint = "/c"
  private createCharEndpoint = "/c/create"
  public characterConsumables: Subject<CharacterConsumables[]>;
  
  constructor(private httpClient: HttpClient, private wsService: WebsocketService) {
    if (isDevMode()) {
     // this.REST_API_SERVER = "http://localhost:8080";
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

  getSizeOfRepo() : Observable<any> {
    return this.httpClient.get(this.REST_API_SERVER+this.countEndpoint)
  }

  createNewCharacter(name : string) {
    const requestParams = new HttpParams().set('name', name)
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin',  '*')
    this.httpClient.post<any>(this.REST_API_SERVER+this.createCharEndpoint, {},
      {headers: headers, params: requestParams}).pipe(
      catchError((err) => {
        console.error(err);
        throw err;
      }
    )).subscribe();


  }
}
  

//   public addNewRecord(){
//     let bodyString = JSON.stringify(this.model); // Stringify payload
//     let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
//     let options       = new RequestOptions({ headers: headers }); // Create a request option

//     this.http.post("http://localhost:3000/posts", this.model, options) // ...using post request
//                      .map(res => res.json()) // ...and calling .json() on the response to return data
//                      .catch((error:any) => Observable.throw(error.json().error || 'Server error')) //...errors if
//                      .subscribe();
// }

