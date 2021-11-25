import { Component, isDevMode, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChatLogComponent } from '../chat-log/chat-log.component';

import { CharacterConsumables } from '../models/entity/character-consumables';
import { NewCharacterComponent } from '../new-character/new-character.component';
import { ConsumablesService } from '../services/consumables-service.service';

@Component({
  selector: 'app-player-box',
  templateUrl: './player-box.component.html',
  styleUrls: ['./player-box.component.css']
})
export class PlayerBoxComponent implements OnInit {
  
  charStatsList : CharacterConsumables[] = [];
  enableGM : FormControl;

  //easy solution to load the right groups
  fridayGroup = ["Dave Doherty", "Glyph Glory", "Maeve Murphy", "Sergei Shubov"]
  tuesdayGroup = ["Alcide", "Henry O'Hoolihan", "Marcel Abdulin", "Zelena Zweig"]

  constructor(private consumableService : ConsumablesService,
     public dialog: MatDialog) { 
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

  openDialog(): void {
    this.dialog.open(NewCharacterComponent, {
      width: '250px',
    });
  }

  filterGroup(): CharacterConsumables[] {
    let todaysGroup = this.chooseGroupByDay();
    return this.charStatsList
      .filter(char => todaysGroup.includes(char.name))
      .sort(function(a,b){return a.name.localeCompare(b.name); })
  }

  private chooseGroupByDay() {
    let todaysGroup = this.fridayGroup;
    if (isDevMode()) //if dev mode, include everyone
      return todaysGroup = this.charStatsList.map(char => char.name);
    
    switch (new Date().getDay()) {
      case 1: //Monday
      case 2: //Tuesday
      case 3: //Wednesday
        todaysGroup = this.tuesdayGroup;
        break;
      default:
        todaysGroup = this.fridayGroup;
        break;
    }
    return todaysGroup;
  }
}

