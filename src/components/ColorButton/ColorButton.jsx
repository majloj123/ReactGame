import React from "react";
import style from "./ColorButton.module.css";

export const ColorButton = () => {
  return (
    <div className={style.colorBtn}>
      <button id="player-color">Change Color</button>
    </div>
  );
};
