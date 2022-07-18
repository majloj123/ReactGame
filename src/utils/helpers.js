import { MAP_DATA } from "./constants";
import { ref, set, update } from "firebase/database";
import { database } from "../firebase";

export function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getKeyString(x, y) {
  return `${x}x${y}`;
}

export function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "COOL",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
  ]);
  const animal = randomFromArray([
    "BEAR",
    "DOG",
    "CAT",
    "FOX",
    "LAMB",
    "LION",
    "BOAR",
    "GOAT",
    "VOLE",
    "SEAL",
    "PUMA",
    "MULE",
    "BULL",
    "BIRD",
    "BUG",
  ]);
  return `${prefix} ${animal}`;
}

export function isSolid(x, y) {
  const blockedNextSpace = MAP_DATA.blockedSpaces[getKeyString(x, y)];

  return (
    blockedNextSpace ||
    x >= MAP_DATA.maxX ||
    x < MAP_DATA.minX ||
    y >= MAP_DATA.maxY ||
    y < MAP_DATA.minY
  );
}

export function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray([
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 2, y: 8 },
    { x: 2, y: 9 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
    { x: 5, y: 8 },
    { x: 5, y: 10 },
    { x: 5, y: 11 },
    { x: 11, y: 7 },
    { x: 12, y: 7 },
    { x: 13, y: 7 },
    { x: 13, y: 6 },
    { x: 13, y: 8 },
    { x: 7, y: 6 },
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 10, y: 8 },
    { x: 8, y: 8 },
    { x: 11, y: 4 },
  ]);
}

export function placeCoin() {
  const { x, y } = getRandomSafeSpot();
  const coinRef = ref(database, `coins/${getKeyString(x, y)}`);
  set(coinRef, {
    x,
    y,
  });

  const coinTimeouts = [2000, 3000, 4000, 5000];
  setTimeout(() => {
    placeCoin();
  }, randomFromArray(coinTimeouts));
}
