import React from "react";
import {Player} from "../game/Player";

function NumberDisplay({num}: {num: number}) {
  return (
    <span>{num}</span>
  );
}

export function PlayerInfo({player}: {player: Player}) {
  return (
    <div>
      <h1>{player?.name}</h1>
      <p>BaseEnergy: <NumberDisplay num={player?.base?.energy} /></p>
      <p>Spirits: <NumberDisplay num={player?.spirits?.length} /></p>
    </div>
  );
}
