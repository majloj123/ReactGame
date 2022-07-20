import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  child,
  get,
  onChildRemoved,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { auth, database } from "../../firebase";
import { PLAYER_COLORS } from "../../utils/constants";
import {
  createName,
  getKeyString,
  getRandomSafeSpot,
  isSolid,
  placeCoin,
} from "../../utils/helpers";
import { KeyPressListener } from "../../utils/KeyPressListener";
import { CharacterList } from "../CharacterList/CharacterList";
import CoinList from "../CoinList/CoinList";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import style from "./GameContainer.module.css";

const GameContainer = () => {
  // my character
  const [playerId, setPlayerId] = useState();

  // global stuffs in game canvas
  const [players, setPlayers] = useState([]);
  const [allPlayersRef] = useState(ref(database, "players"));
  const [coins, setCoins] = useState([]);
  const [allCoinsRef] = useState(ref(database, "coins"));
  const loggedPlayer = useRef();
  const loggedPlayerRef = useRef();

  // let loggedPlayer.current = loggedPlayer.current;

  // functions
  function attemptGrabCoin(x, y) {
    const key = getKeyString(x, y);
    const dbRef = ref(database);

    //watcher for coins database
    get(child(dbRef, `coins`))
      .then((snapshot) => {
        const coins = snapshot.val();

        if (!coins) return;

        if (coins[key]) {
          remove(ref(database, `coins/${key}`));

          loggedPlayer.current.coins++;

          update(loggedPlayerRef.current, {
            coins: loggedPlayer.current.coins,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleArrowPress(xChange = 0, yChange = 0) {
    const newX = loggedPlayer.current.x + xChange;
    const newY = loggedPlayer.current.y + yChange;

    if (!isSolid(newX, newY)) {
      //move to the next space
      loggedPlayer.current.x = newX;
      loggedPlayer.current.y = newY;

      if (xChange === 1) {
        loggedPlayer.current.direction = "right";
      }

      if (xChange === -1) {
        loggedPlayer.current.direction = "left";
      }

      set(loggedPlayerRef.current, loggedPlayer.current);
      attemptGrabCoin(newX, newY);
    }
  }

  function colorUpdate() {
    const mySkinIndex = PLAYER_COLORS.indexOf(loggedPlayer.current.color);
    const nextColor = PLAYER_COLORS[mySkinIndex + 1] || PLAYER_COLORS[0];

    loggedPlayer.current.color = nextColor;

    update(loggedPlayerRef.current, {
      color: loggedPlayer.current.color,
    });
  }

  function nameUpdate(value) {
    const newName = value || createName();
    loggedPlayer.current.name = newName;
    update(loggedPlayerRef.current, {
      name: newName,
    });
  }

  const gameInit = () => {
    // Keyboard settings
    new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1));
    new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1));
    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
    new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0));

    // Gameboard update on change

    // **PLAYER UPDATE**
    onValue(allPlayersRef, (snapshot) => {
      let playerArray = [];
      snapshot.forEach((childSnapshot) => {
        const characterState = childSnapshot.val() || {};
        playerArray.push(characterState);
      });

      setPlayers(playerArray);
    });

    // Gameboard update after player log out
    onChildRemoved(allPlayersRef, (snapshot) => {
      const removedPlayerId = snapshot.val().id;

      setPlayers(players.filter((player) => player.id !== removedPlayerId));
    });

    // **COIN UPDATE**
    onValue(allCoinsRef, (snapshot) => {
      let coinsArray = [];
      snapshot.forEach((childSnapshot) => {
        const coinState = childSnapshot.val() || {};
        coinsArray.push(coinState);
      });

      setCoins(coinsArray);
    });

    // // Gameboard update after coin disappear
    // onChildRemoved(allCoinsRef, (snapshot) => {
    //   const { x, y } = snapshot.val();
    //   console.log("removed", x, y);
    //   console.log("coins", coins);
    //   setCoins(coins.filter((coin) => coin.x !== x && coin.y !== y));
    // });
    // ***** NOT NEEDED FOR NOW *****
  };

  useEffect(() => {
    // user log in
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPlayerId(user.uid);
        loggedPlayerRef.current = ref(database, `players/${user.uid}`);
        // setPlayerRef(userRef);

        const name = createName();

        const { x, y } = getRandomSafeSpot();

        const newPlayer = {
          id: user.uid,
          name: name,
          direction: "right",
          color: "blue",
          x: x,
          y: y,
          coins: 0,
        };

        set(loggedPlayerRef.current, newPlayer);

        loggedPlayer.current = newPlayer;

        //remove
        onDisconnect(loggedPlayerRef.current).remove();

        //Game start
        gameInit(newPlayer);
        placeCoin();
      }
    });
  }, []);

  return (
    <div>
      <PlayerInfo
        name={loggedPlayer.current?.name}
        changeName={nameUpdate}
        changeColor={colorUpdate}
      />
      <div className={style.gameContainer}>
        <CharacterList playerList={players} playerId={playerId} />
        <CoinList coinList={coins} />
      </div>
    </div>
  );
};

export default GameContainer;
