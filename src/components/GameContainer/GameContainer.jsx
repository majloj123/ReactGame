import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  child,
  get,
  onChildAdded,
  onChildRemoved,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { auth, database } from "../../firebase";
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
import style from "./GameContainer.module.css";

const GameContainer = () => {
  // my character
  const [playerId, setPlayerId] = useState();
  const [player, setPlayer] = useState();
  // const [playerRef, setPlayerRef] = useState();

  // global stuffs in game canvas
  const [players, setPlayers] = useState([]);
  const [allPlayersRef, setAllPlayersRef] = useState(ref(database, "players"));
  const [coins, setCoins] = useState([]);
  const [allCoinsRef, setAllCoinsRef] = useState(ref(database, "coins"));

  // functions
  function attemptGrabCoin(x, y, player) {
    const playerRef = ref(database, `players/${player.id}`);
    // console.log(playerRef);
    const key = getKeyString(x, y);
    const dbRef = ref(database);

    get(child(dbRef, `coins`))
      .then((snapshot) => {
        const coins = snapshot.val();
        if (coins[key]) {
          remove(ref(database, `coins/${key}`));

          update(playerRef, {
            name: "Mauu",
          });

          // update(playerRef, {
          //   coins: count + 1,
          // });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleArrowPress(xChange = 0, yChange = 0, player) {
    console.log("arrow press");
    const playerRef = ref(database, `players/${player.id}`);
    const newX = player.x + xChange;
    const newY = player.y + yChange;
    if (!isSolid(newX, newY)) {
      //move to the next space
      player.x = newX;
      player.y = newY;
      if (xChange === 1) {
        player.direction = "right";
      }
      if (xChange === -1) {
        player.direction = "left";
      }
      set(playerRef, player);
      attemptGrabCoin(newX, newY, player);
    }
  }

  const gameInit = (user) => {
    // Keyboard settings
    const activePlayer = user;
    new KeyPressListener("ArrowUp", () =>
      handleArrowPress(0, -1, activePlayer)
    );
    new KeyPressListener("ArrowDown", () =>
      handleArrowPress(0, 1, activePlayer)
    );
    new KeyPressListener("ArrowLeft", () =>
      handleArrowPress(-1, 0, activePlayer)
    );
    new KeyPressListener("ArrowRight", () =>
      handleArrowPress(1, 0, activePlayer)
    );

    // Gameboard update on change

    // **PLAYER UPDATE**
    onValue(allPlayersRef, (snapshot) => {
      console.log("something in all players updated");
      let playerArray = [];
      snapshot.forEach((childSnapshot) => {
        const characterState = childSnapshot.val() || {};
        playerArray.push(characterState);
      });
      setPlayers(playerArray);
    });

    // onChildAdded(allPlayersRef, (snapshot) => {
    //   const addedPlayer = snapshot.val();
    //   setPlayers([...players, addedPlayer]);
    // });

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
  };

  useEffect(() => {
    console.log("renderiiiing auth");
    // user log in
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user is: ", user);
        setPlayerId(user.uid);
        const userRef = ref(database, `players/${user.uid}`);
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

        set(userRef, newPlayer);
        setPlayer(newPlayer);

        //remove
        onDisconnect(userRef).remove();

        //Game start
        gameInit(newPlayer);
        placeCoin();
      }
    });
  }, []);

  return (
    <div className={style.gameContainer}>
      <CharacterList playerList={players} playerId={playerId} />
      <CoinList coinList={coins} />
    </div>
  );
};

export default GameContainer;
