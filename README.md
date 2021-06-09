# yare-io-local

Library to simulate yare.io locally. Has support for running in a vm instance or in an iframe on browser.
Supports just logging out the status or a simple renderer.

Features,
1. Supports Circle and Squares.
2. All APIs mentioned in the doc https://yare.io/documentation.
3. Comparing 2 AIs programmatically.

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