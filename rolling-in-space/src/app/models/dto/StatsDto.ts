import { Consumable } from "../entity/character-consumables";


export class StatsDto {
  name: string;
  might: Consumable;
  speed: Consumable;
  intellect: Consumable;
  stress: Consumable;
  mental: Consumable;
  timesRested: number;

  constructor() { }
}
