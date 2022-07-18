import React from "react";
import style from "./Coin.module.css";

export const Coin = ({ coin }) => {
  const left = 16 * coin.x + "px";
  const top = 16 * coin.y - 4 + "px";

  return (
    <div
      style={{ transform: `translate3d(${left}, ${top}, 0)` }}
      className={`${style.coin} ${style.gridCell}`}
    >
      <div className={`${style.coinShadow} ${style.gridCell}`}></div>
      <div className={`${style.coinSprite} ${style.gridCell}`}></div>
    </div>
  );
};
