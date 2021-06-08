import * as PIXI from "pixi.js";
import {BaseImpl} from "../../impl/BaseImpl";
import {SpiritImpl} from "../../impl/SpiritImpl";
import {Intractable} from "../../globals/gameTypes";

export class RenderObject {
  public readonly entity: Intractable;
  public readonly scale: number;
  public thing: PIXI.Graphics;

  constructor(entity: Intractable) {
    this.entity = entity;
    this.scale = (entity instanceof BaseImpl) ? 5 :
      ((entity instanceof SpiritImpl) ? 1 : 3);
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
