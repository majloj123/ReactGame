import React from "react";
import { Character } from "../Character/Character";

export const CharacterList = ({ playerList, playerId }) => {
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
