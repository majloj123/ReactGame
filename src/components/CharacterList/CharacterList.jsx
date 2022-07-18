import React from "react";
import { Character } from "../Character/Character";

export const CharacterList = ({ playerList, playerId }) => {
  console.log(playerList);
  return (
    <div>
      {playerList?.map((player) => (
        <Character
          key={player?.id}
          player={player}
          isUser={playerId === player?.id}
        />
      ))}
    </div>
  );
};
