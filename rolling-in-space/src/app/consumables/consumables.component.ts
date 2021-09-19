import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CharacterConsumables } from '../models/entity/character-consumables';
import { WebsocketService } from "../services/websocket.service";

@Component({
  selector: 'app-consumables',
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.css'],
  providers: [WebsocketService],
  inputs: ['currentChar', 'parentStatsForm']
})
export class ConsumablesComponent implements OnInit {
  @Input() currentChar : CharacterConsumables;
  @Input() parentStatsForm : FormGroup;

  constructor() {
  }
  
  ngOnInit(): void{
    console.log( "got parent form: " + this.parentStatsForm )
  }

  ngAfterViewInit (): void {
  }

  // validate(event : any) {
  //   var theEvent = event || window.event;
  //   // Handle paste
  //   if (theEvent.type === 'paste') {
  //       key = theEvent.clipboardData.getData('text/plain');
  //   } else {
  //   // Handle key press
  //       var key = theEvent.keyCode || theEvent.which;
  //       key = String.fromCharCode(key);
  //   }
  //   var regex = /[0-9]|\./;
  //   if( !regex.test(key) ) {
  //     theEvent.returnValue = false;
  //     if(theEvent.preventDefault) theEvent.preventDefault();
  //   }
  // }

  rest() {
    this.currentChar.timesRested = (this.currentChar.timesRested+1)%5;
    console.log(this.currentChar.timesRested);
    this.parentStatsForm.get('timesRested')?.setValue(this.currentChar.timesRested);
  }

//this.charCons.find( c: (c.name == charConsum.name)

}


