import {Player} from "../Player";
import {SpiritMoveEvent} from "../events/SpiritMoveEvent";
import {SpiritEnergizeEvent} from "../events/SpiritEnergizeEvent";
import {getBlankSight} from "../utils/misc";
import {Log, Logger} from "../utils/Logger";
import {Intractable, Position, Spirit} from "../globals/gameTypes";
import {SpiritData} from "./Data";
import {SpiritJumpEvent} from "../events/SpiritJumpEvent";

@Log
export class SpiritImpl implements Spirit {
  public id: string;
  public hp = 1;
  public energy: number;
  public energy_capacity: number;
  public size: number;
  public position: Position;
  public sight = getBlankSight();
  public mark: string;
  public mergedCount = 0;

  public owner: Player;

  private logger: Logger;

  constructor(
    id: string, position: Position,
    owner: Player,
  ) {
    this.id = id;
    this.energy = this.energy_capacity = SpiritData[owner.spiritType].energyCapacity;
    this.size = SpiritData[owner.spiritType].size;
    this.position = position;
    this.owner = owner;
  }

  public move(position: Position): void {
    this.owner.game.gameEventLoop.addEvent(new SpiritMoveEvent(this, position));
  }

  public energize(target: Intractable): void {
    this.owner.game.gameEventLoop.addEvent(new SpiritEnergizeEvent(this, target));
  }

  public merge(target: Spirit): void {
  }

  public divide(): void {
  }

  public jump(position: Position): void {
    if (this.energy >= Math.ceil(this.energy_capacity / 2)) {
      this.owner.game.gameEventLoop.addEvent(new SpiritJumpEvent(this, position));
    }
  }

  public shout(message: string): void {
  }

  public set_mark(label: string): void {
  }

  public resetSight() {
    this.sight = getBlankSight();
  }

  public addSpiritToSight(spiritImpl: SpiritImpl) {
    this.updateSightWithSpirit(spiritImpl);
    spiritImpl.updateSightWithSpirit(this);
  }

  public updateSightWithSpirit(spiritImpl: SpiritImpl) {
    if (this.owner === spiritImpl.owner) {
      this.sight.friends.push(spiritImpl.id);
    } else {
      this.sight.enemies.push(spiritImpl.id);
    }
  }
}
