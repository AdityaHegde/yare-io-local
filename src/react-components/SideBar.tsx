import React, {useState} from "react";
import {GameInfo} from "./GameInfo";
import {Yare} from "../Yare";
import {Game} from "../Game";

export function SideBar({yare, game}: {yare: Yare, game: Game}) {
  const [paused, setPaused] = useState<boolean>(false);

  const pause = () => {
    if (paused) {
      yare.resume();
      setPaused(false);
    } else {
      yare.pause();
      setPaused(true);
    }
  }

  return (<div style={{position: "absolute", right: "0px", width: "500px"}}>
  <button onClick={pause}>{paused ? "Resume" : "Pause"}</button>
    <GameInfo game={game} />
  </div>);
}
