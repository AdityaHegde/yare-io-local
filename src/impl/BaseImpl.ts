import {Player} from "../game/Player";
import {SpiritImpl} from "./SpiritImpl";
import {getBlankSight} from "../utils/misc";
import {Base, Position} from "../globals/gameTypes";
import {BaseData} from "./Data";
import {ACTION_DISTANCE} from "../constants";

export class BaseImpl implements Base {
  public id: string;
  public hp = 1;
  public energy = 0;
  public energy_capacity: number;
  public size = 40;
  public position: Position;
  public sight = getBlankSight();
  public structure_type = "base";

  public range = ACTION_DISTANCE;

  public underAttack = false;
  public splitSpirits = new Array<[position: Position, spiritIds: Array<string>, energy: number]>();

  public owner: Player;
  private readonly spiritCost: Array<[low: number, high: number, cost: number]>;
  private spiritCostIdx: number;
  private readonly maxSpirits: number;

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
    this.maxSpirits = BaseData[owner.spiritType].maxSpirits;
  }

  public createSpirit(position: Position) {
    this.spiritIdx++;
    this.spiritCount++;

    if (this.spiritCount > this.spiritCost[this.spiritCostIdx][1]) {
      this.spiritCostIdx++;
    }

    this.owner.addNewSpirit(new SpiritImpl(
      `${this.owner.name}${this.spiritIdx}`, position, this.owner,
    ));
  }

  public removeSpirit(spirit: SpiritImpl) {
    this.spiritCount -= 1 + spirit.mergedCount;

    if (this.spiritCount < this.spiritCost[this.spiritCostIdx][0]) {
      this.spiritCostIdx--;
    }
  }

  public spiritHasSplit(spiritImpl: SpiritImpl) {
    this.splitSpirits.push([
      spiritImpl.position,
      [...spiritImpl.mergedSpiritIds],
      Math.floor(spiritImpl.energy / spiritImpl.mergedCount),
    ]);
  }

  public hasReachedMaxSpirits() {
    return this.spiritCount === this.maxSpirits;
  }

  public postTick() {
    this.createSpiritIfEnoughEnergy();
    this.addBackSplitSpirits();
  }

  private createSpiritIfEnoughEnergy() {
    if (this.underAttack) {
      return;
    }

    if (this.spiritCount < this.maxSpirits &&
      this.energy >= this.spiritCost[this.spiritCostIdx][2]) {
      this.energy -= this.spiritCost[this.spiritCostIdx][2];
      this.createSpirit([
        this.position[0] + 5,
        this.position[1] + 5,
      ]);
    }
  }

  private addBackSplitSpirits() {
    this.splitSpirits.forEach(([position, spiritIds, energy]) => {
      spiritIds.forEach((spiritId) => {
        this.owner.addNewSpirit(new SpiritImpl(
          `${this.owner.name}${spiritId}`, position, this.owner, energy,
        ));
      });
    });
  }
}
