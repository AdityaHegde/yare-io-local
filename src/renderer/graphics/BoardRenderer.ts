import * as PIXI from "pixi.js";
import {Game} from "../../Game";
import {RenderObject} from "./RenderObject";
import {SpiritImpl} from "../../impl/SpiritImpl";
import {Log} from "../../utils/Logger";
import {MAX_X, MAX_Y} from "../../constants";
import {Renderer} from "../Renderer";

@Log
export class BoardRenderer extends Renderer {
  private div: HTMLElement;
  private app: PIXI.Application;
  private renderObjects: Array<RenderObject>;

  constructor(game: Game, div: HTMLElement) {
    super(game);

    this.div = div;
    this.app = new PIXI.Application({
      width: MAX_X, height: MAX_Y,
      backgroundColor: 0x06080a,
      resolution: 0.25,
      antialias: true,
    });
  }

  public async init() {
    this.div.appendChild(this.app.view);
    this.app.stage.interactive = true;

    this.renderObjects = [
      new RenderObject(this.game.star_zxq),
      new RenderObject(this.game.star_a1c),
    ];
    for (let i = 0; i < this.game.players.length; i++) {
      this.renderObjects.push(new RenderObject(this.game.players[i].base));
      this.game.players[i].spirits.forEach(
        spirit => this.renderObjects.push(new RenderObject(spirit))
      );
    }

    this.renderObjects.forEach(renderObject => this.app.stage.addChild(renderObject.init()));
  }

  public async render() {
    this.renderObjects.forEach(renderObject => renderObject.draw());
  }

  public spiritCreated(spirit: SpiritImpl) {
    const renderObject = new RenderObject(spirit);
    this.renderObjects.push(renderObject);
    // this.logger.log(`${renderObject.entity.id} added`);
    this.app.stage.addChild(renderObject.init());
  }

  public spiritDestroyed(spirit: SpiritImpl) {
    const renderObject = this.renderObjects.find(obj => obj.entity.id === spirit.id);
    if (!renderObject) {
      // this.logger.log(`Object not found for ${spirit.id}`);
      return;
    }

    // this.logger.log(`Deleting for ${spirit.id}`);
    this.renderObjects.splice(this.renderObjects.indexOf(renderObject), 1);
    this.app.stage.removeChild(renderObject.thing as any);
    renderObject.destroy();
  }
}
