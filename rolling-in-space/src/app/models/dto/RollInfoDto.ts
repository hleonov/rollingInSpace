import { Tactic } from "../entity/Tactic";

export class PlayerRollInfoDto {
    name: string;
    dicePool: number;
    pcTactic: Tactic;
    rollResult: number;

    constructor(name: string, dicePool: number, pcTactic: Tactic, rollResult: number) {
        this.name = name;
        this.dicePool = dicePool;
        this.pcTactic = pcTactic;
        this.rollResult = rollResult;
    }
}