import React from "react";
import { mapWithIndex, makeBy } from "fp-ts/lib/Array";
import { Color } from "../types";
import { ToggleScoresButton } from "./ToggleScoresButton";
import { DiceSVG } from "./DiceSVG";

type DotProps = { isVisible: boolean; color: string };

const Dot: React.FC<DotProps> = ({ isVisible, color }) => {
  const visible = isVisible ? "" : "invisible";
  return <input className={`bg-${color} rounded-full h-3 w-3 ${visible}`} />;
};

type CustomDieProps = { n: number; dotColor: string; dieColor: string };

export const createDiceMap: Array<(x: number) => boolean> = [
  x => true,
  x => x === 4,
  x => x % 8 === 0,
  x => x % 4 === 0,
  x => x % 2 === 0 && x !== 4,
  x => x % 2 === 0,
  x => x % 3 !== 1
];

const CustomDie: React.FC<CustomDieProps> = ({ n, dotColor, dieColor }) => {
  const getIsVisible = createDiceMap[n];
  const dots1 = makeBy(9, i => (
    <Dot key={i} isVisible={getIsVisible(i)} color={dotColor} />
  ));
  return (
    <div
      className={`bg-${dieColor} shadow rounded-lg w-16 h-16 px-3 py-3 mr-2 mb-2 flex flex-wrap justify-center items-center`}
    >
      {dots1}
    </div>
  );
};

type DiceProps = {
  dice: number[];
  rollDice: () => void;
  showScores: boolean;
  toggleShowScores: () => void;
};

export const Dice: React.FC<DiceProps> = ({
  dice,
  rollDice,
  showScores,
  toggleShowScores
}) => {
  const diceColors: Array<Color | "white"> = [
    "red",
    "yellow",
    "white",
    "white",
    "green",
    "blue"
  ];

  const dies = mapWithIndex((i, color: string) => (
    <DiceSVG
      key={i}
      side={64}
      dots={dice[i]}
      color={color === "white" ? "white" : `${color}`}
    />
  ))(diceColors);

  return (
    <div className="flex flex-col flex-wrap content-end h-36 w-1/2">
      {dies}
      <button
        className="h-16 rounded bg-gray-800 text-gray-100 mb-2 shadow"
        onClick={rollDice}
      >
        Roll
      </button>
      <ToggleScoresButton
        showScores={showScores}
        toggleShowScores={toggleShowScores}
      />
    </div>
  );
};
