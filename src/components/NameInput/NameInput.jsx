import React from "react";
import style from "./NameInput.module.css";

export const NameInput = () => {
  return (
    <div className={style.nameInput}>
      <label htmlFor="player-name">Your Name</label>
      <input id="player-name" maxLength="10" type="text" />
    </div>
  );
};
