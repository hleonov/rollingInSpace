export interface CharacterConsumables {
    name: string;
    might: Consumable;
    speed: Consumable;
    intellect: Consumable;
    stress: Consumable; //if larger than mental, becomes red
    mental: Consumable;
    timesRested: number; //update message
}

export class Consumable {
    maxValue : number = 0;
    currentValue : number = 0;
}