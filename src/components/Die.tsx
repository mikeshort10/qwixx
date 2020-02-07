import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { Color } from "../types";
import { DiceSVG } from "./DiceSVG";
import { Button } from "./Button";
import { constVoid } from "fp-ts/lib/function";
import { ScoreWell } from "./ColorRow";

export const createDiceMap: Array<(x: number) => boolean> = [
  x => true,
  x => x === 4,
  x => x % 8 === 0,
  x => x % 4 === 0,
  x => x % 2 === 0 && x !== 4,
  x => x % 2 === 0,
  x => x % 3 !== 1
];

type DiceProps = {
  dice: number[];
  rollDice: () => void;
  showScores: boolean;
  toggleShowScores: () => void;
  newGame: () => void;
  totalPoints: number;
};

export const Dice: React.FC<DiceProps> = ({
  dice,
  rollDice,
  showScores,
  toggleShowScores,
  newGame,
  totalPoints
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
      <Button onClick={rollDice}>Roll</Button>
      <Button onClick={toggleShowScores}>
        <span>{showScores ? "Hide" : "Show"}</span>
        <span>Scores</span>
      </Button>
      <Button onClick={newGame}>New Game</Button>
      <Button onClick={constVoid}>
        <ScoreWell points={totalPoints} showScores={showScores} />
      </Button>
    </div>
  );
};
