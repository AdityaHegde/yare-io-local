import {Player} from "../Player";
import {SpiritImpl} from "./SpiritImpl";
import {getBlankSight} from "../utils";
import {Base, Position} from "../globals/gameTypes";

const SPIRIT_COST = 50;

export class BaseImpl implements Base {
  public id: string;
  public hp = 100;
  public energy = 0;
  public energy_capacity: number;
  public size = 40;
  public position: Position;
  public sight = getBlankSight();
  public structure_type = "base";

  public underAttack = false;

  public owner: Player;

  private spiritIdx = -1;

  constructor(
    id: string, energy_capacity: number, position: Position,
    owner: Player,
  ) {
    this.id = id;
    this.energy_capacity = energy_capacity;
    this.position = position;
    this.owner = owner;
  }

  public createSpirit(position: Position) {
    this.spiritIdx++;
    return new SpiritImpl(
      `${this.owner.name}${this.spiritIdx}`, 10, 1, position, this.owner,
    );
  }

  public createSpiritIfEnoughEnergy() {
    if (this.underAttack) {
      return;
    }

    while (this.energy >= SPIRIT_COST) {
      this.owner.addNewSpirit(this.createSpirit([
        this.position[0] + 5,
        this.position[1] + 5,
      ]));
      this.energy -= SPIRIT_COST;
    }
  }

  public resetSight() {
    this.sight = getBlankSight();
  }

  public addSpiritToSight(spiritImpl: SpiritImpl) {
    if (this.owner === spiritImpl.owner) {
      this.sight.friends.push(spiritImpl.id);
    } else {
      this.sight.enemies.push(spiritImpl.id);
    }
  }
}
