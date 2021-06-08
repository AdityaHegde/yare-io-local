import {Player} from "../Player";
import {SpiritImpl} from "./SpiritImpl";
import {getBlankSight} from "../utils/misc";
import {Base, Position} from "../globals/gameTypes";
import {BaseData} from "./Data";

const SPIRIT_COST = 50;

export class BaseImpl implements Base {
  public id: string;
  public hp = 1;
  public energy = 0;
  public energy_capacity: number;
  public size = 40;
  public position: Position;
  public sight = getBlankSight();
  public structure_type = "base";

  public underAttack = false;

  public owner: Player;
  private readonly spiritCost: Array<[number, number, number]>;
  private spiritCostIdx: number;

  private spiritIdx = -1;
  private spiritCount = 0;

  constructor(
    id: string, position: Position,
    owner: Player,
  ) {
    this.id = id;
    this.position = position;
    this.owner = owner;

    this.energy_capacity = BaseData[owner.spiritType].energyCapacity;
    this.spiritCost = BaseData[owner.spiritType].cost as Array<[number, number, number]>;
    this.spiritCostIdx = 0;
  }

  public createSpirit(position: Position) {
    this.spiritIdx++;
    this.spiritCount++;

    if (this.spiritCount > this.spiritCost[this.spiritCostIdx][1]) {
      this.spiritCostIdx++;
    }

    return new SpiritImpl(
      `${this.owner.name}${this.spiritIdx}`, position, this.owner,
    );
  }

  public removeSpirit(spirit: SpiritImpl) {
    this.spiritCount -= 1 + spirit.mergedCount;

    if (this.spiritCount < this.spiritCost[this.spiritCostIdx][0]) {
      this.spiritCostIdx--;
    }
  }

  public createSpiritIfEnoughEnergy() {
    if (this.underAttack) {
      return;
    }

    while (this.energy >= this.spiritCost[this.spiritCostIdx][2]) {
      this.energy -= this.spiritCost[this.spiritCostIdx][2];
      this.owner.addNewSpirit(this.createSpirit([
        this.position[0] + 5,
        this.position[1] + 5,
      ]));
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
