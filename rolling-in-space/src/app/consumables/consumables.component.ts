import { Component, OnInit } from '@angular/core';
import { CharacterConsumables } from '../models/character-consumables';
import { ConsumablesService } from '../consumables-service.service';

@Component({
  selector: 'app-consumables',
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.css']
})
export class ConsumablesComponent implements OnInit {
  charCons : CharacterConsumables[] = [];
  constructor(private consumableService : ConsumablesService) { 
  }

  ngOnInit(): void {
    this.consumableService.getCharacterConsumables()
      .subscribe((data : any)=>  {
        console.log(data);
        this.charCons = data;
      })
  }

}
