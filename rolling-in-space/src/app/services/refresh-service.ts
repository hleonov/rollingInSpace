import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CharacterConsumables } from "../models/entity/character-consumables";
import { ConsumablesService } from "./consumables-service.service";

@Injectable({
    providedIn: 'root'
  })
  export class RefreshService {
    private theList : CharacterConsumables[] = [];
    private charStatsList: BehaviorSubject<CharacterConsumables[]> = new BehaviorSubject<CharacterConsumables[]>([]);

    constructor(private consumablesService : ConsumablesService) {
        // this.refresh();
        // console.log("This is from the refrsh constructor: "+this.theList)
        // alert(this.theList)
        // console.log("this is the subject: "+this.getRefresh());
        // alert(this.getRefresh());
    }

    public getRefresh(): Observable<CharacterConsumables[]> {
        return this.charStatsList.asObservable();
     }
     
     public refresh(): void {
        this.consumablesService.getCharacterConsumables()
        .subscribe((data : CharacterConsumables[])=>  {
          console.log(data);
          this.theList = data;
         // this.observableComments.next(Object.assign({}, this.comments));
          this.charStatsList.next(Object.assign({},data));
        });
     } 
  }