import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CharacterConsumables } from './models/character-consumables';

@Injectable({
  providedIn: 'root'
})
export class ConsumablesService {

  //private REST_API_SERVER = "http://localhost:8080/";
  private REST_API_SERVER = "https://infinite-everglades-51264.herokuapp.com";
  private countEndpoint = "/count"
  private charConsumablesEndpoint = "/c"
  constructor(private httpClient: HttpClient) { }

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
}
