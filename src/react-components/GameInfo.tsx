import React from "react";
import {PlayerInfo} from "./PlayerInfo";
import {Game} from "../game/Game";

export function GameInfo({game}: {game: Game}) {
  return (
    <div>
      {game?.players?.map(player => <PlayerInfo key={player.name} player={player} />)}
    </div>
  );
}
