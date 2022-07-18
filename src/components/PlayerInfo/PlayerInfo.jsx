import React from "react";
import { ColorButton } from "../ColorButton/ColorButton";
import { NameInput } from "../NameInput/NameInput";
import style from "./PlayerInfo.module.css";

const PlayerInfo = () => {
  return (
    <div className={style.playerInfo}>
      <NameInput />
      <ColorButton />
    </div>
  );
};

export default PlayerInfo;
