# yare-io-local

Library to simulate yare.io locally. Has support for running in a vm instance or in an iframe on browser.
Supports just logging out the status or a simple renderer.

Features,
1. Supports Circle and Squares.
2. All APIs mentioned in the doc https://yare.io/documentation.
3. Comparing 2 AIs programmatically.
4. Compare eco of N different AIs. Battle can be unpredictable as all AIs will be put on the same board.

## Installation guide

```
npm i @adityahegde/yare-io-local --save-dev
```
For showing a basic board in a browser,
```
npm i pixi.js --save-dev
```

## Usage

### Testing in nodejs

Library supports running code within a vm.

```typescript
import {Game, GameRunner, BlankRenderer, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {VmRunner} from "@adityahegde/yare-io-local/dist/runner/VmRunner";

const game = new Game([
  // Player one's spirit type.
  SpiritType.Circle,
  // Player two's spirit type.
  SpiritType.Circle,
]);
const yare = new Yare(
  game,
  new GameRunner(game, [
    // takes path to script. Player one's runner.
    new VmRunner(process.argv[2]),
    // takes path to script. Player two's runner.
    new VmRunner(process.argv[3]),
  ]),
  // BlankRenderer that leaves all methods blank.
  // Extend Renderer and implement your own.
  new BlankRenderer(game),
  // Generates the base map as of now
  new MapGenerator(MapData.getBasicMapData()),
  {runIntervalInMs: 5},
);
yare.init().then(() => yare.resume());
```

If your AI can run independently in the same scope, replace VmRunner with LocalAIRunner,
```typescript
new GameRunner(game, [
  new LocalAIRunner(() => {
    // run player one's AI here.
  }),
  new LocalAIRunner(() => {
    // run player two's AI here.
  }),
]);
```
This is helpful when building the AI programmatically with different parameters.
Both player's AIs share the global scope so make sure it only depends on globals defined in the docs.

### Testing in a browser

This example uses react and webpack. Take webpack config from this repo.

```typescript jsx
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import {Game, GameRunner, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {SideBar} from "@adityahegde/yare-io-local/dist/react-components"
import {BoardRenderer} from "@adityahegde/yare-io-local/dist/renderer/graphics";
import {IframeRunner} from "@adityahegde/yare-io-local/dist/runner/IframeRunner";

const div = document.createElement("div");
document.body.appendChild(div);

const game = new Game([
  // Player one's spirit type.
  SpiritType.Circle,
  // Player two's spirit type.
  SpiritType.Circle,
]);
const yare = new Yare(
  game,
  new GameRunner(game, [
    // Runs code in an iframe. Takes url of the script.
    // Player one's script
    new IframeRunner("http://localhost:8000/yare.js"),
    // Runs code in an iframe. Takes url of the script.
    // Player one's script
    new IframeRunner("http://localhost:8000/yare.js"),
  ]),
  // renders a simple board
  new BoardRenderer(game, div),
  // Generates the base map as of now
  new MapGenerator(MapData.getBasicMapData()),
  { runIntervalInMs: 50 },
);

setTimeout(() => {
  yare.init().then(() => yare.resume());
});

ReactDOM.render(
  <SideBar game={game} yare={yare} />,
  div,
);
```

I used `python3 -m http.server 8000` for hosting the assets.

### Testing multiple AIs in parallel
Check bin/test-yare.ts,
```typescript
import {BlankRenderer, Game, GameRunner, MapData, MapGenerator, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {VmRunner} from "@adityahegde/yare-io-local/dist/runner/VmRunner";

const playerFiles = [];
for (let i = 2; i < process.argv.length; i++) {
  playerFiles.push(process.argv[i]);
}

// Assumes all players are Circle. Can be anything.
// Just make sure spiritTypes is equal to AIRunners passed to GameRunner
const game = new Game(playerFiles.map(_ => SpiritType.Circle));
const yare = new Yare(
  game,
  // creates a VmRunner for every file passed to the script.
  // make sure this is equal to spiritTypes passed to Game constructor
  new GameRunner(game, playerFiles.map(playerFile => new VmRunner(playerFile))),
  new BlankRenderer(game),
  new MapGenerator(MapData.getBasicMapData()),
  { runIntervalInMs: 5 },
);
(async () => {
  // runs until one of the player is dead of has reached max spirits
  // end condition per player can be modified by passing a function as 1st arg
  // also runs to a max of 2000 ticks. can be modified by passing 2nd arg
  await yare.runUntil();

  // prints spirit count and whether player is dead
  game.players.forEach((player, idx) => {
    console.log(`${playerFiles[idx]}: Spirits=${player.spirits.length} ${player.base.hp <= 0 ? "Dead" : ""}`);
  });
})();
```