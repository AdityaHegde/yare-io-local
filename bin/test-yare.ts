import {Game} from "../src/Game";
import {GameRunner} from "../src/runner/GameRunner";
import {VmRunner} from "../src/runner/VmRunner";
import {Yare} from "../src/Yare";
import {LoggerRenderer} from "../src/renderer/LoggerRenderer";

const game = new Game();
const yare = new Yare(
  game,
  new GameRunner(game, [
    new VmRunner(process.argv[2]), new VmRunner(process.argv[3]),
  ]),
  new LoggerRenderer(game),
  { runIntervalInMs: 5 },
);
yare.init().then(() => yare.resume());
