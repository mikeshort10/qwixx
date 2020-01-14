import React, { useState } from "react";
import { Points, colorNames } from "./components/Points";
import { DivClick, Square } from "./types";
import { mapWithIndex, replicate, map } from "fp-ts/lib/Array";
import { Strike } from "./components/Strike";
import { flow } from "fp-ts/lib/function";
import { Die } from "./components/Die";
import { selectNumber } from "./logic/selectNumber";

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

  const addStrike: DivClick = () =>
    strikes === 4 ? null : setStrikes(strikes + 1);

  const strikeArray = replicate(4, false).map((_, i) =>
    i + 1 === strikes ? 5 * (i + 1) : 0
  );

  const rollDice = () =>
    flow(
      map(() => Math.ceil(Math.random() * 6)),
      setDice
    )(dice);

  const selectNumberFromDice = selectNumber(dice);

  return (
    <div>
      <Points
        showScores={showScores}
        statuses={colors}
        setStatuses={setColors}
        setStatusOpen={selectNumberFromDice}
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
