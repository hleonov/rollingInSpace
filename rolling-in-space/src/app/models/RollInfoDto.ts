import { Tactic } from "./Tactic";

export class RollInfoDto {
    dicePool: number;
    targetNumber: number;
    pcTactic: Tactic;
    gmTactic: Tactic;
    rollResult: number;
}