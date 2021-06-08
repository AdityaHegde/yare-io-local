import {Renderer} from "./Renderer";
import {Log} from "../utils/Logger";
import {SpiritImpl} from "../impl/SpiritImpl";
import {Player} from "../Player";

@Log
export class LoggerRenderer extends Renderer {
  public async init(): Promise<void> {}

  public async render(): Promise<void> {
    this.logger.log(`********** New tick **********`);
    this.game.players.forEach(player => this.logPlayerStats(player));
  }

  public spiritCreated(spirit: SpiritImpl) {}

  public spiritDestroyed(spirit: SpiritImpl) {}

  private logPlayerStats(player: Player) {
    this.logger.log(`Player: ${player.name}`);
    this.logger.log(`Base Energy: ${player.base.energy}`);
    this.logger.log(`Spirits: ${player.spirits.length}`);
  }
}
