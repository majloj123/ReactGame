import React from "react";
import style from "./ColorButton.module.css";

export const ColorButton = ({ changeColor }) => {
  return (
    <div className={style.colorBtn}>
      <button onClick={changeColor} id="player-color">
        Change Color
      </button>
    </div>
  );
};
