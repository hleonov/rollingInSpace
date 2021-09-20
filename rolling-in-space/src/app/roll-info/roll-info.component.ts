import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Tactic } from "../models/entity/Tactic";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WebsocketService } from '../services/websocket.service';
import { PlayerRollInfoDto as PlayerRollInfoDto } from '../models/dto/RollInfoDto';
import { GmRollInfoDto } from '../models/dto/GmRollInfoDto';
import { RollService } from '../services/roll-service';

@Component({
  selector: 'app-roll-info',
  templateUrl: './roll-info.component.html',
  styleUrls: ['./roll-info.component.css']
})
export class RollInfoComponent implements OnInit {

  @Input() parentEnabledGM : FormControl;
  @Input() charName : string;

  public Tactic = Tactic; //for the selecttion dropdown iteration
  public readonly INITIAL_OPPOSING_TN = 0;
  public readonly  TACTIC_INITIAL_VALUE = "Choose tactic...";
  private readonly playerGroup = 'playerInfo';
  private readonly gmGroup = 'gmInfo';

  private theGmTactic : Tactic;

  numOfSuccesses : number;
  rollInfoForm : FormGroup;


  constructor(private formBuilder: FormBuilder, 
    private webSocketService: WebsocketService, private rollService: RollService) { 
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

   this.rollInfoForm.get(this.playerGroup)?.valueChanges
    .pipe(debounceTime(700)).pipe(distinctUntilChanged()).subscribe((info: any) => {
     this.webSocketService.sendRollInfoDto(
        this.createPlayerRollInfoDto(info)
     )
   });
   this.rollInfoForm.get(this.gmGroup)?.valueChanges
   .pipe(debounceTime(700)).pipe(distinctUntilChanged()).subscribe((info: any) => {
    this.webSocketService.sendGmRollInfoDto(
       this.createGmRollInfoDto(info)
    )
  });
      
  }

createPlayerRollInfoDto(info : any): PlayerRollInfoDto {
  return new PlayerRollInfoDto(
    this.charName,
    info.dicePool ?? this.rollInfoForm.get(this.playerGroup)?.get("dicePool")?.value ?? 0,
    info.playerTactic ?? this.rollInfoForm.get(this.playerGroup)?.get("playerTactic")?.value ?? this.TACTIC_INITIAL_VALUE,
    this.numOfSuccesses);
}

createGmRollInfoDto(info : any) : GmRollInfoDto {
  return new GmRollInfoDto(
    this.charName,
    info.targetNumber ?? this.rollInfoForm.get(this.gmGroup)?.get("targetNumber")?.value ?? this.INITIAL_OPPOSING_TN,
    info.gameMasterTactic ?? this.rollInfoForm.get(this.gmGroup)?.get("gameMasterTactic")?.value ?? this.TACTIC_INITIAL_VALUE,
    info.exposeGMTactic ?? false);
}

handlePlayerRollInfoChanges(dto : PlayerRollInfoDto) {
  if (dto.name !== this.charName) {
    return;
  }
  console.log("consuming player info for char: "+dto.name)
  this.numOfSuccesses = dto.rollResult;
  this.rollInfoForm.get(this.playerGroup)?.setValue({
    dicePool : dto.dicePool,
    playerTactic : dto.pcTactic,
  }, {emitEvent: false});
}
 
handleGmRollInfoChanges(dto : GmRollInfoDto) {
  if (dto.name !== this.charName) {
    return;
  }
  //do not change the shown form value for GM tactics, unless it was changed from own client, but store the dto one secretly
  const currentGMTactic = this.rollInfoForm.get(this.gmGroup)?.get("gameMasterTactic")?.value || this.TACTIC_INITIAL_VALUE ;
  this.theGmTactic = dto.gmTactic;
  console.log("consuming GM info for char: "+dto.name+"\tsetting hidden gmTactics: "+this.theGmTactic)

  this.rollInfoForm.get(this.gmGroup)?.setValue({
    targetNumber: dto.targetNumber,
    gameMasterTactic : dto.exposeGMTactic ? this.theGmTactic : currentGMTactic
  }, {emitEvent: false});
}

rollAndSync() {
    this.numOfSuccesses = this.rollService.rollDice(
      this.rollInfoForm.get(this.playerGroup)?.get("dicePool")?.value,
      this.rollInfoForm.get(this.playerGroup)?.get("playerTactic")?.value,
      this.rollInfoForm.get(this.gmGroup)?.get("targetNumber")?.value,
      this.theGmTactic,
    );

    // sync others
    this.webSocketService.sendRollInfoDto(this.createPlayerRollInfoDto({}));
    this.webSocketService.sendGmRollInfoDto(this.createGmRollInfoDto({gameMasterTactic: this.theGmTactic, exposeGMTactic: true}));
  }

  readyToRoll() : boolean{
        return (this.rollInfoForm.get(this.gmGroup)?.get("targetNumber")?.value != 0
          && this.theGmTactic ? (this.theGmTactic.toString() !== this.TACTIC_INITIAL_VALUE ? true : false) : false);
  }

  resetForm() {
    console.log("reset form");
    this.rollInfoForm.reset();
    this.numOfSuccesses = 0;
    this.webSocketService.sendRollInfoDto(this.createPlayerRollInfoDto({}));
    this.webSocketService.sendGmRollInfoDto(this.createGmRollInfoDto({exposeGMTactic: true}));
  }
}



