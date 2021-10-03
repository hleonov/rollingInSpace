import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { CharacterConsumables } from '../models/entity/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';

@Component({
  selector: 'app-player-box',
  templateUrl: './player-box.component.html',
  styleUrls: ['./player-box.component.css']
})
export class PlayerBoxComponent implements OnInit {
  
  charStatsList : CharacterConsumables[] = [];
  enableGM : FormControl;

  constructor(private consumableService : ConsumablesService) { 
    this.enableGM = new FormControl(false);
  }

  ngOnInit(): void {
    console.log("init player box");
    this.consumableService.getCharacterConsumables()
      .subscribe((data : CharacterConsumables[])=>  {
        console.log(data);
        this.charStatsList = data;
    });
  }

}

