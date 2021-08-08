import { Component, OnInit } from '@angular/core';
import { CharacterConsumables } from '../models/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';

@Component({
  selector: 'app-player-box',
  templateUrl: './player-box.component.html',
  styleUrls: ['./player-box.component.css']
})
export class PlayerBoxComponent implements OnInit {
  //private numberOfCharacters : number = 0;
  charStatsList : CharacterConsumables[] = [];

  constructor(private consumableService : ConsumablesService) { 
  }

  ngOnInit(): void {
    this.consumableService.getCharacterConsumables()
      .subscribe((data : any)=>  {
        console.log(data);
        this.charStatsList = data;
    });
    // this.consumableService.getSizeOfRepo()
    //   .subscribe((size : number)=>  {
    //     console.log(size);
    //     this.numberOfCharacters = size;
    //   })
  }
  
}
