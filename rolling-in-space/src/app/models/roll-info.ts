export interface RollInfo {
    targetNumber: number;
    tactic: Tactic;
    dice: number;
    result: number;
}

export enum Tactic {
    quickly = "Quickly",
    fiercfully = "Fiercefully",
    indirectly = "Indirectly", 
    consistently = "Consistently", 
    precisely = "Precisely"
}