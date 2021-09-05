import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tactic } from '../models/roll-info';

@Component({
  selector: 'app-roll-info',
  templateUrl: './roll-info.component.html',
  styleUrls: ['./roll-info.component.css']
})
export class RollInfoComponent implements OnInit {

  public Tactic = Tactic;
  public DEFAULT_OPPOSING_TN = 4;

  AUTOMATIC_SUCCESS = 6;
  numOfSuccesses : number;
  rollInfoForm : FormGroup;
  
  constructor(private formBuilder: FormBuilder) { 
    this.numOfSuccesses = 0;
    this.initRollingForm();
  }

  private initRollingForm() {
    let numberRegEx = /^[0-9]\d*$/g;
    let validators = [Validators.required, Validators.pattern(numberRegEx)];
    this.rollInfoForm = this.formBuilder.group({
      dicePool: [0, validators],
      targetNumber: [this.DEFAULT_OPPOSING_TN, validators]
    });
  }

  ngOnInit(): void {
  }

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

  rollDice() {
    let successCounter = 0;
    let numDice  : number = this.rollInfoForm.get("dicePool")?.value;
    let TN : number = this.rollInfoForm.get("targetNumber")?.value;
    let [adjustedDiceNum, adjustedTN] = this.adjustDiceAndTN(numDice, TN);
    console.log("number of dice to roll: "+numDice+" adjusted: "+adjustedDiceNum);
    console.log("target number: "+TN+" adjusted: "+adjustedTN);

    for (let i = 0; i < adjustedDiceNum; i++) {
      successCounter = this.performRollRoutine(adjustedTN, successCounter);
     
    }
    this.numOfSuccesses = successCounter;
  }

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
