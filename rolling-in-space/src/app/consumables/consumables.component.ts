import { Component, OnInit } from '@angular/core';
import { CharacterConsumables } from '../models/character-consumables';
import { ConsumablesService } from '../consumables-service.service';

@Component({
  selector: 'app-consumables',
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.css']
})
export class ConsumablesComponent implements OnInit {
  // character: CharacterConsumables = {
  //   name: 'Windstorm',
  //   // might: 13,
  //   // speed: 15,
  //   // intellect: 9,
  //   // stress: 3,
  //   // mental: 4,
  //   timesRested: 1
  // };

  charCons : CharacterConsumables[] = [];
  constructor(private consumableService : ConsumablesService) { 
  }

  ngOnInit(): void {
    this.consumableService.getCharacterConsumables()
      .subscribe((data : any)=>  {
        console.log(data);
        this.charCons = data;
        // this.character.name = data[0].name;
        // this.character.timesRested = data[0].timesRested;
      })
  }

}
