import React from "react";
import style from "./Character.module.css";

export const Character = ({ player, isUser }) => {
  if (!player) {
    return null;
  }

  const left = 16 * player.x + "px";
  const top = 16 * player.y - 4 + "px";

  return (
    <div
      data-direction={player.direction}
      data-color={player.color}
      style={{ transform: `translate3d(${left}, ${top}, 0)` }}
      className={`${style.character} ${style.gridCell} ${
        isUser ? style.you : null
      }`}
    >
      <div className={`${style.characterShadow} ${style.gridCell}`}></div>
      <div className={`${style.characterSprite} ${style.gridCell}`}></div>
      <div className={style.characterNameContainer}>
        <span className={style.characterName}>{player.name}</span>
        <span className={style.characterCoins}>{player.coins}</span>
      </div>
      <div className={style.characterYouArrow}></div>
    </div>
  );
};
