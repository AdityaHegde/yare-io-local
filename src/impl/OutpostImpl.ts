import {Outpost, Position} from "../globals/gameTypes";
import {getBlankSight} from "../utils/misc";
import {Player} from "../game/Player";
import {
  OUTPOST_ADDITIONAL_RANGE,
  OUTPOST_ADDITIONAL_THRESHOLD,
  OUTPOST_ADDITIONAL_USAGE,
  OUTPOST_RANGE,
  OUTPOST_USAGE
} from "../constants";
import {SpiritImpl} from "./SpiritImpl";

export class OutpostImpl implements Outpost {
  public id: string;
  public hp = 1;
  public energy = 0;
  public energy_capacity = 1000;
  public size = 20;
  public position: Position;
  public sight = getBlankSight();
  public structure_type = "outpost";

  public control = "";
  public range = OUTPOST_RANGE;
  public usage = OUTPOST_USAGE;

  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
  }

  public owner: Player;

  public takeControl(owner: Player, energy: number) {
    this.owner = owner;
    this.control = owner.name;
    this.energy += energy;
  }

  public loseControl() {
    this.owner = null;
    this.control = "";
  }

  public addSpiritToSight(spiritImpl: SpiritImpl) {
    if (this.owner === spiritImpl.owner) {
      this.sight.friends.push(spiritImpl.id);
    } else {
      this.sight.enemies.push(spiritImpl.id);
    }
  }

  public postTick() {
    this.attackInRange();
    this.updateRangeAndUsage();
  }

  private attackInRange() {
    if (this.sight.enemies_beamable.length === 0 || this.energy < this.usage) {
      return;
    }

    const idx = Math.round(Math.random() * (this.sight.enemies_beamable.length - 1));

    const spirit = this.owner.game.spirits[this.sight.enemies_beamable[idx]];

    if (spirit.energy > 0) {
      spirit.energy = Math.max(spirit.energy - this.usage, 0);
    } else {
      spirit.hp = Math.max(0, spirit.energy - this.usage);
    }
    this.energy -= this.usage;
  }

  private updateRangeAndUsage() {
    if (this.energy >= OUTPOST_ADDITIONAL_THRESHOLD) {
      this.range = OUTPOST_ADDITIONAL_RANGE;
      this.usage = OUTPOST_ADDITIONAL_USAGE;
    } else {
      this.range = OUTPOST_RANGE;
      this.usage = OUTPOST_USAGE;
    }
  }
}
