import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TacticTable } from "../models/TacticTable";
import { Tactic } from "../models/Tactic";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WebsocketService } from '../services/websocket.service';
import { PlayerRollInfoDto as PlayerRollInfoDto } from '../models/RollInfoDto';
import { GmRollInfoDto } from '../models/GmRollInfoDto';

@Component({
  selector: 'app-roll-info',
  templateUrl: './roll-info.component.html',
  styleUrls: ['./roll-info.component.css']
})
export class RollInfoComponent implements OnInit {

  @Input() parentEnabledGM : FormControl;
  @Input() charName : string;

  public Tactic = Tactic;
  public readonly INITIAL_OPPOSING_TN = 0;
  public readonly  TACTIC_INITIAL_VALUE = "Choose tactic...";
  readonly AUTOMATIC_SUCCESS = 6;

  private theGmTactic : Tactic;

  numOfSuccesses : number;
  rollInfoForm : FormGroup;

  constructor(private formBuilder: FormBuilder, private  tacticTable: TacticTable, 
    private webSocketService: WebsocketService) { 
    this.numOfSuccesses = 0;
   this.initRollInfoForm();
  }

  ngOnInit(): void {
    this.webSocketService.PlayerRollInfoChangedEvents.subscribe((dto : PlayerRollInfoDto) => {
      this.handlePlayerRollInfoChanges(dto);
    })
    this.webSocketService.gmInfoChangedEvents.subscribe((dto : GmRollInfoDto) => {
      this.handleGmRollInfoChanges(dto);
    })
  }

  private initRollInfoForm() {
    let numberRegEx = /^[0-9]\d*$/g;
    let validators = [Validators.required, Validators.pattern(numberRegEx)];
    this.rollInfoForm = this.formBuilder.group({
      playerInfo: this.formBuilder.group({
       dicePool: [0, validators],
        playerTactic: [this.TACTIC_INITIAL_VALUE]
     }),
     gmInfo : this.formBuilder.group({
        targetNumber: [this.INITIAL_OPPOSING_TN, validators],
        gameMasterTactic: [{ value: this.TACTIC_INITIAL_VALUE, disabled: !this.parentEnabledGM }]
      })
   });

   this.rollInfoForm.get('playerInfo')?.valueChanges
    .pipe(debounceTime(700)).pipe(distinctUntilChanged()).subscribe((info: any) => {
     this.webSocketService.sendRollInfoDto(
        this.createPlayerRollInfoDto(info)
     )
   });
   this.rollInfoForm.get('gmInfo')?.valueChanges
   .pipe(debounceTime(700)).pipe(distinctUntilChanged()).subscribe((info: any) => {
    this.webSocketService.sendGmRollInfoDto(
       this.createGmRollInfoDto(info)
    )
  });
      
  }

createPlayerRollInfoDto(info : any): PlayerRollInfoDto {
  var dto = new PlayerRollInfoDto();
  dto.name = this.charName;
  dto.dicePool = info.dicePool ?? this.rollInfoForm.get('playerInfo')?.get("dicePool")?.value ?? 0;
  dto.pcTactic = info.playerTactic ?? this.rollInfoForm.get('playerInfo')?.get("playerTactic")?.value ?? this.TACTIC_INITIAL_VALUE;
  dto.rollResult = this.numOfSuccesses; 
  return dto;
}

createGmRollInfoDto(info : any) : GmRollInfoDto {
  var dto = new GmRollInfoDto();
  dto.name = this.charName;
  dto.targetNumber = info.targetNumber ?? this.rollInfoForm.get('gmInfo')?.get("targetNumber")?.value ?? this.INITIAL_OPPOSING_TN
  dto.gmTactic = info.gameMasterTactic ?? this.rollInfoForm.get('gmInfo')?.get("gameMasterTactic")?.value ?? this.TACTIC_INITIAL_VALUE;
  dto.exposeGMTactic = info.exposeGMTactic ?? false;
  return dto;
}
handlePlayerRollInfoChanges(dto : PlayerRollInfoDto) {
  if (dto.name !== this.charName) {
    return;
  }
  console.log("consuming player info for char: "+dto.name)
  this.numOfSuccesses = dto.rollResult;
  this.rollInfoForm.get('playerInfo')?.setValue({
    dicePool : dto.dicePool,
    playerTactic : dto.pcTactic,
  }, {emitEvent: false});
}
 

handleGmRollInfoChanges(dto : GmRollInfoDto) {
  if (dto.name !== this.charName) {
    return;
  }
  //do not change the shown form value for GM tactics, unless it was changed from own client, but store the dto one secretly
  const currentGMTactic = this.rollInfoForm.get('gmInfo')?.get("gameMasterTactic")?.value || this.TACTIC_INITIAL_VALUE ;
  this.theGmTactic = dto.gmTactic;
  console.log("consuming GM info for char: "+dto.name+"\tsetting hidden gmTactics: "+this.theGmTactic)

  this.rollInfoForm.get('gmInfo')?.setValue({
    targetNumber: dto.targetNumber,
    gameMasterTactic : dto.exposeGMTactic ? this.theGmTactic : currentGMTactic
  }, {emitEvent: false});
}

  //step 2
  adjustDiceAndTN(numDice : number, TN : number) : [number, number] {
    let adjustedDiceNum = numDice;
    let adjustedTN = TN; 
      
    if (adjustedTN > 6) {
      [adjustedDiceNum, adjustedTN] = this.adjustLargeTN(numDice, TN)
    }

    if (adjustedTN < 2) {
      [adjustedDiceNum, adjustedTN]  = this.adjustSmallTN(numDice, TN);
    }
    return [adjustedDiceNum,adjustedTN]
  }

  adjustLargeTN(numDice : number, TN : number) : [number, number] {
    let adjustedDiceNum = numDice;
    let adjustedTN = TN;
    while (adjustedTN > 6) {
      adjustedDiceNum = Math.ceil(adjustedDiceNum/2);
      adjustedTN = adjustedTN-1;
      console.log("TN > 6, halving dice to: "+adjustedDiceNum+ ", decreasing TN: "+adjustedTN)
    }
    return [adjustedDiceNum, adjustedTN];
  }

  adjustSmallTN(numDice : number, TN : number) : [number, number] {
    let adjustedDiceNum = numDice;
    let halfDice = Math.ceil(numDice/2);
    let adjustedTN = TN;
    while (adjustedTN < 2) {
      adjustedDiceNum += halfDice;
      adjustedTN++;
      console.log("TN < 2, adding 50% dice: "+adjustedDiceNum+ ", increasing TN: "+adjustedTN)
    }
    return [adjustedDiceNum, adjustedTN];
  }

  //step 1
  adjustTNaccordingToTactic(TN : number) : number {
    let playerT = this.rollInfoForm.get('playerInfo')?.get("playerTactic")?.value;
    
    console.log("player tactic: "+playerT+"\tgm tactic: "+this.theGmTactic);
    return TN + this.tacticTable.getModification(playerT, this.theGmTactic);
  }

  rollDice() {
    let successCounter = 0;
    let numDice  : number = this.rollInfoForm.get('playerInfo')?.get("dicePool")?.value;
    let TN : number = this.rollInfoForm.get('gmInfo')?.get("targetNumber")?.value;
    //step 1: tactics modifies TN
    let modifiedTN : number = this.adjustTNaccordingToTactic(TN);
    console.log("after tactic modification: "+modifiedTN)
    //step 2: adjust TN and dice when too high/low
    let [adjustedDiceNum, adjustedTN] = this.adjustDiceAndTN(numDice, modifiedTN);
    console.log("number of dice to roll: "+numDice+" adjusted: "+adjustedDiceNum);
    console.log("target number: "+TN+" adjusted: "+adjustedTN);

    //step 3: roll each die from dice pool
    for (let i = 0; i < adjustedDiceNum; i++) {
      successCounter = this.performRollRoutine(adjustedTN, successCounter);
    }
    this.numOfSuccesses = successCounter;

    //step 4: sync others
    this.webSocketService.sendRollInfoDto(this.createPlayerRollInfoDto({}));
    this.webSocketService.sendGmRollInfoDto(this.createGmRollInfoDto({gameMasterTactic: this.theGmTactic, exposeGMTactic: true}));
  }

  //step 3
  performRollRoutine(TN : number, successCounter : number) : number{
    let roll = this.rollDie();
    
    if (roll < TN) { //failure
      return successCounter;
    }
    if (roll == this.AUTOMATIC_SUCCESS) { //critical success, add another die
      console.log("rolled 6! adding a roll...")
      successCounter++
      return this.performRollRoutine(TN, successCounter);
    }
    return ++successCounter; //normal success: roll >= TN
  }
  
  rollDie() : number {
    let rolled = Math.floor(Math.random() * 6) + 1;
    console.log("rolled: "+rolled);
    return rolled;
  }


}



