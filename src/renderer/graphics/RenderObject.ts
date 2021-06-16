import * as PIXI from "pixi.js";
import {BaseImpl} from "../../impl/BaseImpl";
import {Intractable} from "../../globals/gameTypes";
import {OutpostImpl} from "../../impl/OutpostImpl";
import {EnergyImpl} from "../../impl/EnergyImpl";

export class RenderObject {
  public readonly entity: Intractable;
  public readonly scale: number;
  public thing: PIXI.Graphics;

  constructor(entity: Intractable) {
    this.entity = entity;

    if (entity instanceof BaseImpl) {
      this.scale = 5;
    } else if (entity instanceof OutpostImpl) {
      this.scale = 3;
    } else if (entity instanceof EnergyImpl) {
      this.scale = 2;
    } else {
      this.scale = 1;
    }
  }

  public init(): PIXI.Graphics {
    this.thing = new PIXI.Graphics();
    this.thing.lineStyle(2 * this.scale, 0xFEEB77, 1);
    this.thing.beginFill(0x650A5A, 1);
    this.thing.drawCircle(0, 0, 10 * this.scale);
    this.thing.endFill();
    this.draw();
    return this.thing;
  }

  public draw() {
    this.thing.x = this.entity.position[0];
    this.thing.y = this.entity.position[1];
  }

  public destroy() {
    this.thing.destroy();
  }
}
