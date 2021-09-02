import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Stats } from 'fs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CharacterConsumables, Consumable } from '../models/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';
import { MessageDto, StatsDto, WebsocketService } from '../services/websocket.service';

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
      speedMax: new FormControl(stat.speed.maxValue, Validators.pattern(numberRegEx)),
      speedCur: new FormControl(stat.speed.currentValue, Validators.pattern(numberRegEx)),
      intellectMax: new FormControl(stat.intellect.maxValue, Validators.pattern(numberRegEx)),
      intellectCur: new FormControl(stat.intellect.currentValue, Validators.pattern(numberRegEx)),
      stressMax: new FormControl(stat.stress.maxValue, Validators.pattern(numberRegEx)),
      stressCur: new FormControl(stat.stress.currentValue, Validators.pattern(numberRegEx)),
      mentalMax: new FormControl(stat.mental.maxValue, Validators.pattern(numberRegEx)),
      mentalCur: new FormControl(stat.mental.currentValue, Validators.pattern(numberRegEx)),
      timesRested: new FormControl(stat.timesRested)
    });
    form.valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .subscribe((stats: any) => {
        this.webSocketService.sendMessage(
           createStatsDto(stat.name, stats)
          //new MessageDto(stat.name, stats.mightMax, stats.mightCur)
          )
      });
    this.charStatsForm.push(form);
    console.log("max might from Form is: "+form.get('mightMax')?.value);
  }

  handleStatsChange(dto : StatsDto) {
    console.log("consumed stats change in playerbox: "+dto);
    let i = this.charStatsList.findIndex( c =>(c.name == dto.name));
    this.charStatsList[i].timesRested = dto.timesRested;
    this.charStatsForm[i].setValue({
      mightMax: dto.might.maxValue, 
      mightCur: dto.might.currentValue,
      speedMax: dto.speed.maxValue,
      speedCur: dto.speed.currentValue,
      intellectMax: dto.intellect.maxValue,
      intellectCur: dto.intellect.currentValue,
      stressMax: dto.stress.maxValue, 
      stressCur: dto.stress.currentValue,
      mentalMax: dto.mental.maxValue,
      mentalCur: dto.mental.currentValue,
      timesRested: dto.timesRested
    }, {emitEvent: false});
  }
}
function createStatsDto(name : string, stats: any): StatsDto {
  var dto  = new StatsDto();
  dto.name = name;
  dto.might = new Consumable(stats.mightMax, stats.mightCur);
  dto.speed = new Consumable(stats.speedMax, stats.speedCur);
  dto.intellect = new Consumable(stats.intellectMax, stats.intellectCur);
  dto.stress = new Consumable(stats.stressMax, stats.stressCur);
  dto.mental = new Consumable(stats.mentalMax, stats.mentalCur);
  dto.timesRested = stats.timesRested;
  return dto;
}

