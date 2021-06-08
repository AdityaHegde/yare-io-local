import {Game} from "../src";
import {GameRunner} from "../src";
import {VmRunner} from "../src/runner/VmRunner";
import {Yare} from "../src";
import {LoggerRenderer} from "../src";
import {SpiritType} from "../src/SpiritType";

const game = new Game([SpiritType.Circle, SpiritType.Circle]);
const yare = new Yare(
  game,
  new GameRunner(game, [
    new VmRunner(process.argv[2]), new VmRunner(process.argv[3]),
  ]),
  new LoggerRenderer(game),
  { runIntervalInMs: 5 },
);
yare.init().then(() => yare.resume());
