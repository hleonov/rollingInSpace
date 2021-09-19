import { Tactic } from "./Tactic";

export class GmRollInfoDto {
    name: string;
    targetNumber: number;
    gmTactic: Tactic;
    exposeGMTactic : boolean;
}