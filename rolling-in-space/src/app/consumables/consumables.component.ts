import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { StatsDto } from '../models/dto/StatsDto';
import { CharacterConsumables } from '../models/entity/character-consumables';
import { WebsocketService } from "../services/websocket.service";
import { StatsFormObject } from '../models/entity/StatsFormObject';
import { CharChangeService } from '../services/char-change.service';

@Component({
  selector: 'app-consumables',
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.css'],
  providers: [WebsocketService],
  inputs: ['currentChar', 'parentStatsForm', 'playerBoxNum']
})
export class ConsumablesComponent implements OnInit {
  @Input() currentChar : CharacterConsumables;
  @Input() charList : CharacterConsumables[]
  @Input() playerBoxNum : number;

  public pointsToAllocate = 0;
  public statForm : FormGroup;
  public statsFormObject : StatsFormObject
  
  constructor(
    private formBuilder: FormBuilder,
    public webSocketService: WebsocketService, 
    private charChangeService : CharChangeService) {

  }
  
  ngOnInit(): void{
    this.webSocketService.connect();
    this.webSocketService.statsEvents$.subscribe(dto => {
      this.handleStatsChange(dto);
    })
    this.addStatsForm(this.currentChar)
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  addStatsForm(stat : CharacterConsumables) {
    let numberRegEx =     /^[0-9]\d*$/g ;// /^\d+$/;
    let validators = [Validators.required, Validators.pattern(numberRegEx)];
    this.statForm = this.formBuilder.group({
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
    this.statsFormObject = new StatsFormObject(this.statForm.value)
    this.statForm.valueChanges
      .pipe(debounceTime(700))
      .pipe(distinctUntilChanged())
      .subscribe((stats: StatsFormObject) => {
        // console.log(" LOOK form changes for: ",this.currentChar)
        // console.log("LOOK VALUES: ",stats)
        this.balanceRested(stats);
        this.webSocketService.sendStatsDto(
           this.createStatsDto(stats)
        )
        this.statsFormObject = this.statForm.value;
      });
  }

  handleStatsChange(dto : StatsDto) {
    if (dto.name !== this.currentChar.name) {
      return;
    }
    console.log("consumed stats change: "+dto);
    // let i = this.charStatsList.findIndex( c =>(c.name == dto.name));
    //this.charCons.find( c: (c.name == charConsum.name)
    this.currentChar.timesRested = dto.timesRested;
    this.statForm.setValue({  
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

   createStatsDto(stats: StatsFormObject): StatsDto {
      return (new StatsFormObject(stats)).toDto(stats, this.currentChar.name);
  }

  onCharChange() {
    this.handleStatsChange(this.currentChar);
    this.charChangeService.changeChar({ boxIndex: this.playerBoxNum, name: this.currentChar.name})
  }
  
  rest() {
    this.currentChar.timesRested = (this.currentChar.timesRested+1)%5;
    console.log(this.currentChar.timesRested);
    this.statForm.get('timesRested')?.setValue(this.currentChar.timesRested);
    this.pointsToAllocate = Math.floor(Math.random() * 6) + 1;
  }

  balanceRested(stats: any) {
    if (this.pointsToAllocate > 0) {
      console.log("balancing rested with stats: " + stats)
      this.pointsToAllocate -= this.getDiffFromUpdatedStat(this.statsFormObject, stats)
    }
  }

   getDiffFromUpdatedStat(prevStats : any, newStats: any) : number {
    var updated = Object.keys(newStats)
        .filter(prop =>  (prop != "timesRested") && (prevStats[prop] !== newStats[prop]));
     if (updated.length == 0) {
       return 0;
     } else {
       var diff = Object.keys(newStats)
          .filter(prop => (prop != "timesRested") && (prevStats[prop] !== newStats[prop]))
          .map(prop => newStats[prop] - prevStats[prop])
       console.log("diff property: " + updated);
       console.log("diff is: " + diff[0]);
       return diff[0] >= 0 ? diff[0] : 0;
     }
   }
}


