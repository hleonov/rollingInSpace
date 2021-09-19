import { Tactic } from "../entity/Tactic";

export class GmRollInfoDto {
    name: string;
    targetNumber: number;
    gmTactic: Tactic;
    exposeGMTactic : boolean;

    constructor(name : string, targetNumber: number, gmTactic: Tactic, exposeGMTactic : boolean) {
        this.name = name;
        this.targetNumber = targetNumber;
        this.gmTactic = gmTactic;
        this.exposeGMTactic = exposeGMTactic;
    }
}