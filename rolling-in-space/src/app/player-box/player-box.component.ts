import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CharacterConsumables } from '../models/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';
import { MessageDto, WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-player-box',
  templateUrl: './player-box.component.html',
  styleUrls: ['./player-box.component.css']
})
export class PlayerBoxComponent implements OnInit {
  
  charStatsList : CharacterConsumables[] = [];
  charStatsForm : FormGroup[] = [];

  constructor(private consumableService : ConsumablesService,
    public webSocketService: WebsocketService) { 
  }

  ngOnInit(): void {
    this.webSocketService.connect();
    this.webSocketService.events.subscribe(dto => {
      this.handleStatsChange(dto);
    })
    console.log("init player box");
    this.consumableService.getCharacterConsumables()
      .subscribe((data : any)=>  {
        console.log(data);
        this.charStatsList = data;
        this.initForms();
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  exampleWS() {
    this.webSocketService.sendMessage(new MessageDto("Tobi", 20, 20))
  }

  initForms() {
    console.log("-------------> INIT STATS FORMS")
    this.charStatsList.forEach( (initialStat, i) => { 
      console.log("init form for char "+i+"\t"+initialStat)
      this.addStatsForm(initialStat)
  });
  }

  addStatsForm(stat : any) {
    let numberRegEx = /^(0|[1-9]\d*)?$/;
    let form = new FormGroup({
      mightMax: new FormControl(stat.might.maxValue, Validators.pattern(numberRegEx)),
      mightCur: new FormControl(stat.might.currentValue, Validators.pattern(numberRegEx)),
      timesRested: new FormControl(stat.timesRested)
    });
    form.valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .subscribe((stats: any) => {
        console.log("form value changed: " + stats.mightMax + " \t" + stats.mightCur)
        this.webSocketService.sendMessage(new MessageDto(stat.name, stats.mightMax, stats.mightCur))
      });
    this.charStatsForm.push(form);
    console.log("max might from Form is: "+form.get('mightMax')?.value);
  }

  handleStatsChange(dto : MessageDto) {
    console.log("consumed stats change in playerbox: "+dto);
    this.charStatsForm[0].setValue({
      mightMax: dto.mightMax, 
      mightCur: dto.mightCur,
      timesRested: 3
    }, {emitEvent: false});
  }
}
