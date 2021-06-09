import {Renderer} from "./Renderer";
import {SpiritImpl} from "../impl/SpiritImpl";

/**
 * Blank renderer.
 */
export class BlankRenderer extends Renderer {
  public async init(): Promise<void> {}

  public async render(): Promise<void> {}

  public spiritCreated(spirit: SpiritImpl) {}

  public spiritDestroyed(spirit: SpiritImpl) {}
}
