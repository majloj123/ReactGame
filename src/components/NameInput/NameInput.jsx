import React, { useState } from "react";
import style from "./NameInput.module.css";

export const NameInput = ({ changeName, name }) => {
  const [playerName, setPlayerName] = useState(name || "Write name");

  return (
    <form
      className={style.nameInput}
      onSubmit={(e) => {
        e.preventDefault();
        changeName(playerName);
      }}
    >
      <label htmlFor="player-name">Your Name</label>
      <input
        id="player-name"
        maxLength="10"
        type="text"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
      />
    </form>
  );
};
