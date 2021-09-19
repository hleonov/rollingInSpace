import { Tactic } from "./Tactic";

export class PlayerRollInfoDto {
    name: string;
    dicePool: number;
    pcTactic: Tactic;
    rollResult: number;
}