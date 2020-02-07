import React from "react";
import { Dice } from "./Die";
import { Strikes } from "./Strike";
import { ReactHook, Color, Square } from "../types";

type AdditionalFieldsProps = {
  strikes: number;
  setStrikes: ReactHook<number>;
  showScores: boolean;
  setColorRows: ReactHook<Record<Color, Square[]>>;
  stringifyAndSend: (type: string) => (message: string) => void;
  dice: number[];
  rollDice: () => void;
  toggleShowScores: () => void;
  totalPoints: number;
  newGame: () => void;
};

export const AdditionalFields: React.FC<AdditionalFieldsProps> = ({
  strikes,
  setStrikes,
  showScores,
  dice,
  rollDice,
  toggleShowScores,
  totalPoints,
  newGame
}) => {
  return (
    <div className="flex justify-between mt-2 w-full">
      <Strikes
        strikes={strikes}
        setStrikes={setStrikes}
        showScores={showScores}
      />
      <Dice
        newGame={newGame}
        dice={dice}
        rollDice={rollDice}
        showScores={showScores}
        toggleShowScores={toggleShowScores}
        totalPoints={totalPoints}
      />
    </div>
  );
};
