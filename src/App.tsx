import React, { useState, useEffect } from "react";
import { Points } from "./components/Points";
import { Color, Locked, ReactHook, Square } from "./types";
import { map, reduce } from "fp-ts/lib/Array";
import { Strikes } from "./components/Strike";
import { flow } from "fp-ts/lib/function";
import { Dice } from "./components/Die";
import { randomInt } from "fp-ts/lib/Random";
import { reduceWithIndex, some } from "fp-ts/lib/Record";
import {
  createSquares,
  updateSquares,
  lockRow,
  modifyRightFromIndexWhile,
  trace
} from "./functions";
import { pipe } from "fp-ts/lib/pipeable";
import { none, fromNullable } from "fp-ts/lib/Option";

const lockedState: Locked = {
  red: false,
  blue: false,
  green: false,
  yellow: false
};

type Moves = {
  [color in Color]: [number, number];
} & { white: number };

const calculatePossibleMoves = (dice: number[]): Moves => {
  const [red, yellow, w1, w2, green, blue] = dice;
  const moves = { red, yellow, green, blue };
  return reduceWithIndex(
    { white: w1 + w2 } as Moves,
    (color, acc, n: number) => ({
      ...acc,
      [color]: [n + w1, n + w2]
    })
  )(moves);
};

export const indexIsSelectable = (dice: number[]) => (
  color: Color,
  index: number
) => (squares: Square[]) => {
  const {
    white,
    [color]: [color1, color2]
  } = calculatePossibleMoves(dice);
  const { value } = squares[index];
  console.log(calculatePossibleMoves(dice));
  if (white !== value && color1 !== value && color2 !== value) {
    return none;
  }
  return fromNullable(squares);
};

// todo: undo last move
// todo: styling changes for dice, buttons, strikes
// todo: websockets

const isSelected = ({ isSelected }: Square) => isSelected;

const removeDisabled = (square: Square) => ({ ...square, isDisabled: false });

const unlockRow = (
  squares: Square[],
  setSquares: ReactHook<Square[]>,
  unlock: () => void
) => () =>
  pipe(
    squares,
    modifyRightFromIndexWhile(removeDisabled, isSelected)(11),
    setSquares,
    trace(() => "hey"),
    unlock
  );

const toggleLock = (isLocked: boolean) => (isLocked ? unlockRow : lockRow);

const App: React.FC = () => {
  const [red, setRed] = useState(createSquares());
  const [yellow, setYellow] = useState(createSquares());
  const [green, setGreen] = useState(createSquares(false));
  const [blue, setBlue] = useState(createSquares(false));
  const [strikes, setStrikes] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [dice, setDice] = useState([1, 2, 3, 4, 5, 6]);
  const [locked, setLocked] = useState(lockedState);

  const colors: Record<Color, Square[]> = { red, yellow, green, blue };
  const setColors = { setRed, setYellow, setGreen, setBlue };

  useEffect(() => {
    flow(
      reduce(locked, (acc, color: Color) => {
        const { isSelected, isDisabled } = colors[color][10];
        if (isSelected && locked[color] === false) {
          return { ...acc, [color]: isSelected };
        } else if (
          isSelected === false &&
          isDisabled === false &&
          locked[color]
        ) {
          return { ...acc, [color]: isSelected };
        }
        return acc;
      }),
      setLocked
    )(["red", "yellow", "green", "blue"]);
  }, [colors, locked]);

  const toggleShowScores = () => setShowScores(!showScores);

  const rollDice = () => flow(map(randomInt(1, 6)), setDice)(dice);

  const updateLocked = (lockedColor: Color, isLocked: boolean) => {
    return () => setLocked({ ...locked, [lockedColor]: !isLocked });
  };

  const setStatusOpen = updateSquares(dice);

  return (
    <div className="rotate flex flex-col items-center h-144">
      <Points
        showScores={showScores}
        statuses={colors}
        setStatuses={setColors}
        setStatusOpen={setStatusOpen}
        toggleLock={toggleLock}
        updateLocked={updateLocked}
        locked={locked}
      />
      <div className="flex justify-between mt-2 w-144">
        <Strikes
          strikes={strikes}
          setStrikes={setStrikes}
          showScores={showScores}
        />
        <Dice
          dice={dice}
          rollDice={rollDice}
          showScores={showScores}
          toggleShowScores={toggleShowScores}
        />
      </div>
    </div>
  );
};

export default App;
