import React from "react";
import { ColorButton } from "../ColorButton/ColorButton";
import { NameInput } from "../NameInput/NameInput";
import style from "./PlayerInfo.module.css";

const PlayerInfo = ({ changeColor, changeName, name }) => {
  return (
    <div className={style.playerInfo}>
      <NameInput name={name} changeName={changeName} />
      <ColorButton changeColor={changeColor} />
    </div>
  );
};

export default PlayerInfo;
