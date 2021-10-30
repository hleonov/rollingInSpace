import { StatsDto } from '../dto/StatsDto';
import { Consumable } from './character-consumables';

export class StatsFormObject {
  mightMax: number;
  mightCur: number;
  speedMax: number;
  speedCur: number;
  intellectMax: number;
  intellectCur: number;
  stressMax: number;
  stressCur: number;
  mentalMax: number;
  mentalCur: number;
  timesRested: number;

  constructor(init?: Partial<StatsFormObject>) {
    Object.assign(this, init);
  }

  public toDto(stats: StatsFormObject, name: string): StatsDto {
    var dto = new StatsDto();
    dto.name = name;
    dto.might = new Consumable(stats.mightMax, stats.mightCur);
    dto.speed = new Consumable(stats.speedMax, stats.speedCur);
    dto.intellect = new Consumable(stats.intellectMax, stats.intellectCur);
    dto.stress = new Consumable(stats.stressMax, stats.stressCur);
    dto.mental = new Consumable(stats.mentalMax, stats.mentalCur);
    dto.timesRested = stats.timesRested;
    return dto;
  }
}
