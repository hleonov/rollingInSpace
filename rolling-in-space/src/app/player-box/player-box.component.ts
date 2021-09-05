import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CharacterConsumables, Consumable } from '../models/character-consumables';
import { ConsumablesService } from '../services/consumables-service.service';
import { StatsDto, WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-player-box',
  templateUrl: './player-box.component.html',
  styleUrls: ['./player-box.component.css']
})
export class PlayerBoxComponent implements OnInit {
  
  charStatsList : CharacterConsumables[] = [];
  charStatsForm : FormGroup[] = [];

  constructor(
    private consumableService : ConsumablesService, 
    private formBuilder: FormBuilder,
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
    this.charStatsList.forEach( (initialStat, i) => { 
      this.addStatsForm(initialStat)
  });
  }

  //TODO refactor and make it nicer
  addStatsForm(stat : any) {
    let numberRegEx =     /^[0-9]\d*$/g ;// /^\d+$/;
    let validators = [Validators.required, Validators.pattern(numberRegEx)];
    let form = this.formBuilder.group({
      mightMax: [stat.might.maxValue, validators],
      mightCur: [stat.might.currentValue, validators],
      speedMax: [stat.speed.maxValue, validators],
      speedCur: [stat.speed.currentValue, validators],
      intellectMax: [stat.intellect.maxValue, validators],
      intellectCur: [stat.intellect.currentValue, validators],
      stressMax: [stat.stress.maxValue, validators],
      stressCur: [stat.stress.currentValue, validators],
      mentalMax: [stat.mental.maxValue,  validators],
      mentalCur: [stat.mental.currentValue,  validators],
      timesRested: [stat.timesRested]
    });

    form.valueChanges
      .pipe(debounceTime(700))
      .pipe(distinctUntilChanged())
      .subscribe((stats: any) => {
        this.webSocketService.sendMessage(
           createStatsDto(stat.name, stats)
        )
      });
    this.charStatsForm.push(form);
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

