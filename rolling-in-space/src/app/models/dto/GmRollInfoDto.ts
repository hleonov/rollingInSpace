import { Tactic } from "../entity/Tactic";

export class GmRollInfoDto {
    name: string;
    targetNumber: number;
    gmTactic: Tactic;
    exposeGMTactic : boolean;
}