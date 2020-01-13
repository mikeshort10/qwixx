import React, { useState } from "react";
import { Points } from "./components/Points";
import { ReactHook, DivClick, ButtonClick } from "./types";
import { mapWithIndex, findLastIndex, replicate } from "fp-ts/lib/Array";
import { Strike } from "./components/Strike";
import { toNullable } from "fp-ts/lib/Option";
import { flow } from "fp-ts/lib/function";
import { calculateSelected } from "./components/ColorRow";

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

const squareIsSelected = ({ isSelected }: Square) => isSelected;

const lastSelectedIndex = flow(findLastIndex(squareIsSelected), toNullable);

const selectNumber = (squares: Square[], setColor: ReactHook<Square[]>) => {
  return (i: number): ButtonClick => () => {
    const selectedSquare = squares[i];
    if (selectedSquare.isDisabled || selectedSquare.isSelected) {
      return;
    }
    if (selectedSquare.isLast && calculateSelected(squares) < 5) {
      return;
    }
    const lastSelected = lastSelectedIndex(squares) || -1;
    const nowDisabled = squares
      .slice(lastSelected + 1, i)
      .map(x => ({ ...x, isDisabled: true }));
    const updatedSquare: Square = { ...squares[i], isSelected: true };
    setColor([
      ...squares.slice(0, lastSelected + 1),
      ...nowDisabled,
      updatedSquare,
      ...squares.slice(i + 1)
    ]);
  };
};

const App: React.FC = () => {
  const [red, setRed] = useState(createArrayOf());
  const [yellow, setYellow] = useState(createArrayOf());
  const [green, setGreen] = useState(createArrayOf(false));
  const [blue, setBlue] = useState(createArrayOf(false));
  const [strikes, setStrikes] = useState(0);
  const [showScores, setShowScores] = useState(true);

  const toggleShowScores = () => setShowScores(!showScores);

  const colors = { red, yellow, green, blue };
  const setColors = { setRed, setYellow, setGreen, setBlue };

  const addStrike: DivClick = () =>
    strikes === 4 ? null : setStrikes(strikes + 1);

  const strikeArray = replicate(4, false).map((_, i) =>
    i + 1 === strikes ? 5 * (i + 1) : 0
  );

  return (
    <div>
      <Points
        showScores={showScores}
        statuses={colors}
        setStatuses={setColors}
        setStatusOpen={selectNumber}
      />
      <div className="flex mt-2 items-stretch">
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
      </div>
    </div>
  );
};

export default App;
