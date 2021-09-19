import { Injectable } from "@angular/core";
import { Tactic } from "../models/entity/Tactic";
import { TacticTable } from "../models/entity/TacticTable";

@Injectable({
  providedIn: 'root'
})
export class RollService {
  readonly AUTOMATIC_SUCCESS = 6;

  constructor(private tacticTable: TacticTable) { }

  rollDice(numDice  : number,  pcTactic: Tactic, TN : number, gmTactic: Tactic) {
    let successCounter = 0;
    //step 1: tactics modifies TN
    let modifiedTN : number = this.adjustTNaccordingToTactic(TN, gmTactic, pcTactic);
    console.log("after tactic modification: "+modifiedTN)

    //step 2: adjust TN and dice when too high/low
    let [adjustedDiceNum, adjustedTN] = this.adjustDiceAndTN(numDice, modifiedTN);
    console.log("number of dice to roll: "+numDice+" adjusted: "+adjustedDiceNum);
    console.log("target number: "+TN+" adjusted: "+adjustedTN);

    //step 3: roll each die from dice pool
    for (let i = 0; i < adjustedDiceNum; i++) {
      successCounter = this.performRollRoutine(adjustedTN, successCounter);
    }
    return successCounter;
  }
  
  //step 1
  adjustTNaccordingToTactic(TN: number, gmTactic: Tactic, pcTactic: Tactic): number {
    console.log("player tactic: " + pcTactic + "\tgm tactic: " + gmTactic);
    return TN + this.tacticTable.getModification(pcTactic, gmTactic);
  }

  //step 2
  adjustDiceAndTN(numDice: number, TN: number): [number, number] {
    let adjustedDiceNum = numDice;
    let adjustedTN = TN;

    if (adjustedTN > 6) {
      [adjustedDiceNum, adjustedTN] = this.adjustLargeTN(numDice, TN)
    }

    if (adjustedTN < 2) {
      [adjustedDiceNum, adjustedTN] = this.adjustSmallTN(numDice, TN);
    }
    return [adjustedDiceNum, adjustedTN]
  }

  //step 2.a
  adjustLargeTN(numDice: number, TN: number): [number, number] {
    let adjustedDiceNum = numDice;
    let adjustedTN = TN;
    while (adjustedTN > 6) {
      adjustedDiceNum = Math.ceil(adjustedDiceNum / 2);
      adjustedTN = adjustedTN - 1;
      console.log("TN > 6, halving dice to: " + adjustedDiceNum + ", decreasing TN: " + adjustedTN)
    }
    return [adjustedDiceNum, adjustedTN];
  }

  //step 2.b
  adjustSmallTN(numDice: number, TN: number): [number, number] {
    let adjustedDiceNum = numDice;
    let halfDice = Math.ceil(numDice / 2);
    let adjustedTN = TN;
    while (adjustedTN < 2) {
      adjustedDiceNum += halfDice;
      adjustedTN++;
      console.log("TN < 2, adding 50% dice: " + adjustedDiceNum + ", increasing TN: " + adjustedTN)
    }
    return [adjustedDiceNum, adjustedTN];
  }

  //step 3
  performRollRoutine(TN: number, successCounter: number): number {
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

  rollDie(): number {
    let rolled = Math.floor(Math.random() * 6) + 1;
    console.log("rolled: " + rolled);
    return rolled;
  }
}