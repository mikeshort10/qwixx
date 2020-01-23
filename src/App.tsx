import React, { useState } from "react";
import { Points, colorNames } from "./components/Points";
import { ReactHook, DivClick } from "./types";
import {
  mapWithIndex,
  findLastIndex,
  replicate,
  map,
  modifyAt
} from "fp-ts/lib/Array";
import { Strike } from "./components/Strike";
import { getOrElse } from "fp-ts/lib/Option";
import { flow, Predicate, Endomorphism } from "fp-ts/lib/function";
import { Die } from "./components/Die";
import { pipe } from "fp-ts/lib/pipeable";

export type Square = {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
  isLast: boolean;
};

const createArrayOf = (lowToHigh = true, length = 11): Square[] => {
  return Array(length)
    .fill(null)
    .map(
      (_, i): Square => ({
        isSelected: false,
        isDisabled: false,
        value: lowToHigh ? i + 2 : length + 1 - i,
        isLast: i === length - 1
      })
    );
};

// const squareIsSelected = ({ isSelected }: Square) => isSelected;

// const lastSelectedIndex = flow(findLastIndex(squareIsSelected), toNullable);

// const selectNumber = (dice: number[]) => {
//   // const [white1, white2, red, yellow, green, blue] = dice;
//   return (squares: Square[], setColor: ReactHook<Square[]>) => {
//     return (i: number): ButtonClick => () => {
//       const selectedSquare = squares[i];
//       if (selectedSquare.isDisabled || selectedSquare.isSelected) {
//         return;
//       }
//       if (selectedSquare.isLast && calculateSelected(squares) < 5) {
//         return;
//       }
//       const lastSelected = lastSelectedIndex(squares) || -1;
//       const nowDisabled = squares
//         .slice(lastSelected + 1, i)
//         .map(x => ({ ...x, isDisabled: true }));
//       const updatedSquare: Square = { ...squares[i], isSelected: true };
//       setColor([
//         ...squares.slice(0, lastSelected + 1),
//         ...nowDisabled,
//         updatedSquare,
//         ...squares.slice(i + 1)
//       ]);
//     };
//   };
// };

// const takeRightWhile = <A,>(predicate: Predicate<A>) => (as: A[]) =>
//   pipe(as, reverse, takeLeftWhile(predicate), reverse);

const isSelectable = ({ isDisabled, isSelected }: Square) =>
  !isDisabled && !isSelected;

// const getRemainingSquares = (squares: Square[]) =>
//   pipe(squares, takeRightWhile(isSelectable));

const isBetweenExc = (end: number) => (start: number) => (n: number) =>
  start < n && end < n;

const getRangeToUpdate = <A,>(end: number, predicate: Predicate<A>, as: A[]) =>
  pipe(
    as,
    findLastIndex(predicate),
    getOrElse(() => 0),
    isBetweenExc(end)
  );

type MRFIW = <A>(
  modifier: Endomorphism<A>,
  predicate: Predicate<A>
) => (end: number) => (as: A[]) => A[];

const modifyRightFromIndexWhile: MRFIW = (modifier, predicate) => end => as =>
  pipe(
    as,
    mapWithIndex((i, a) =>
      getRangeToUpdate(end, predicate, as)(i) ? modifier({ ...a }) : { ...a }
    )
  );

const selectSquare = (square: Square) => ({ ...square, isDisabled: true });

const modifyWhileUnselected = modifyRightFromIndexWhile(
  selectSquare,
  isSelectable
);

const passToIo = (fn: Function) => (x: any) => () => fn(x);

const updateSquares = (squares: Square[], setColor: ReactHook<Square[]>) => {
  return (index: number) => {
    return pipe(
      modifyWhileUnselected(index)(squares),
      modifyAt(index, (a: Square) => ({ ...a, isSelected: true })),
      getOrElse(() => squares),
      passToIo(setColor)
    );
  };
};

// todo: updateSquares not modifying disabled squares

const App: React.FC = () => {
  const [red, setRed] = useState(createArrayOf());
  const [yellow, setYellow] = useState(createArrayOf());
  const [green, setGreen] = useState(createArrayOf(false));
  const [blue, setBlue] = useState(createArrayOf(false));
  const [strikes, setStrikes] = useState(0);
  const [showScores, setShowScores] = useState(true);
  const [dice, setDice] = useState([1, 2, 3, 4, 5, 6]);

  const toggleShowScores = () => setShowScores(!showScores);

  const colors = { red, yellow, green, blue };
  const setColors = { setRed, setYellow, setGreen, setBlue };

  // const select = (index: number) =>

  const addStrike: DivClick = () =>
    strikes === 4 ? null : setStrikes(strikes + 1);

  const strikeArray = replicate(4, false).map((_, i) =>
    i + 1 === strikes ? 5 * (i + 1) : 0
  );

  const rollDice = () =>
    flow(
      map(x => Math.ceil(Math.random() * 6)),
      setDice
    )(dice);

  // const selectNumberFromDice = selectNumber(dice);

  return (
    <div>
      <Points
        showScores={showScores}
        statuses={colors}
        setStatuses={setColors}
        setStatusOpen={updateSquares}
      />
      <div className="flex mt-2">
        <div className="flex">
          {mapWithIndex((i, value: number) => (
            <Strike key={i} value={value} addStrike={addStrike} />
          ))(strikeArray)}
        </div>
        <button
          className="mx-3 px-2 bg-gray-800 text-white rounded flex justify-center items-center"
          onClick={toggleShowScores}
        >
          {(showScores ? "Hide" : "Show") + " Scores"}
        </button>
        <div className="flex">
          {mapWithIndex((i, color: string) => (
            <Die key={i} value={dice[i]} color={color} />
          ))(["white", "white", ...colorNames])}
        </div>
        <button
          className="mx-3 px-2 bg-gray-800 text-white rounded flex justify-center items-center"
          onClick={rollDice}
        >
          Roll
        </button>
      </div>
    </div>
  );
};

export default App;
