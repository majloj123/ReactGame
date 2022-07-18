import React from "react";
import { Coin } from "../Coin/Coin";

const CoinList = ({ coinList }) => {
  return (
    <div>
      {coinList?.map((coin, index) => (
        <Coin key={index} coin={coin} />
      ))}
    </div>
  );
};

export default CoinList;
