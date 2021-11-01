import { Component, OnInit, Inject, } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatsDto } from '../models/dto/StatsDto';
import { Consumable } from '../models/entity/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';
import { RefreshService } from '../services/refresh-service';

export interface DialogData {
  place: string;
  name : string;
}

@Component({
  selector: 'app-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.css']
})
export class NewCharacterComponent implements OnInit {

  data: DialogData = { name: "", place: "" };
  constructor(
    public dialogRef: MatDialogRef<NewCharacterComponent>,
    private consumablesService : ConsumablesService,
  ) {
  }

  ngOnInit(): void {
  }
  
  addCharacter(): void {
    this.consumablesService.createNewCharacter(this.data.name);
    // this.refreshService.refresh();
  }

}