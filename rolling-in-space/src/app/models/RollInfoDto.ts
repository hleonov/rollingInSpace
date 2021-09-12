import { Tactic } from "./Tactic";

export class RollInfoDto {
    name: string;
    dicePool: number;
    targetNumber: number;
    pcTactic: Tactic;
    gmTactic: Tactic;
    rollResult: number;
}