import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { Color } from "../types";
import { DiceSVG } from "./DiceSVG";
import { Button } from "./Button";
import { ScoreWell } from "./ColorRow";
import { strictEqual } from "fp-ts/lib/Eq";
import { flow, not, constTrue, constVoid } from "fp-ts/lib/function";

type DotProps = { isVisible: boolean; color: string };

const Dot: React.FC<DotProps> = ({ isVisible, color }) => {
  const visible = isVisible ? "" : "invisible";
  return <input className={`bg-${color} rounded-full h-3 w-3 ${visible}`} />;
};

type CustomDieProps = { n: number; dotColor: string; dieColor: string };

const modulo = (m: number) => (x: number) => x % m;

const equals = (a: number) => (b: number) => strictEqual(a, b);

export const createDiceMap: Array<(x: number) => boolean> = [
  constTrue,
  equals(4),
  flow(modulo(8), equals(0)),
  flow(modulo(4), equals(0)),
  x => x % 2 === 0 && equals(4)(x),
  flow(modulo(2), equals(0)),
  flow(modulo(3), not(equals(0)))
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
