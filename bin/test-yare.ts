import {BlankRenderer, Game, GameRunner, MapData, MapGenerator, SpiritType, Yare} from "../src";
import {VmRunner} from "../src/runner/VmRunner";

const playerFiles = [];
for (let i = 2; i < process.argv.length; i++) {
  playerFiles.push(process.argv[i]);
}

const game = new Game(playerFiles.map(_ => SpiritType.Circle));
const yare = new Yare(
  game,
  new GameRunner(game, playerFiles.map(playerFile => new VmRunner(playerFile))),
  new BlankRenderer(game),
  new MapGenerator(MapData.getBasicMapData()),
  { runIntervalInMs: 5 },
);
(async () => {
  await yare.runUntil();

  game.players.forEach((player, idx) => {
    console.log(`${playerFiles[idx]}: Spirits=${player.spirits.length} ${player.base.hp <= 0 ? "Dead" : ""}`);
  });
})();
