import React from "react";
import { ReactHook, DivClick } from "../types";
import { makeBy } from "fp-ts/lib/Array";
import { flow, increment, decrement } from "fp-ts/lib/function";
import { gt, ordNumber } from "fp-ts/lib/Ord";

type StrikeProps = {
  value: string | null;
  setStrikes: DivClick;
};

export const Strike: React.FC<StrikeProps> = ({ value, setStrikes }) => {
  return (
    <div
      onClick={setStrikes}
      className="mr-2 mb-2 h-16 w-16 border rounded well bg-gray-600 text-white flex justify-center items-center bg-gray-100"
    >
      {value}
    </div>
  );
};

type StrikesProps = {
  strikes: number;
  setStrikes: ReactHook<number>;
  showScores: boolean;
};

export const Strikes: React.FC<StrikesProps> = ({
  strikes,
  setStrikes,
  showScores
}) => {
  const addStrike = flow(increment, setStrikes);
  const removeStrike = flow(decrement, setStrikes);

  const handleClick = (strikes: number, n: number) => () =>
    gt(ordNumber)(strikes, n) ? removeStrike(strikes) : addStrike(strikes);

  const showValue = showScores ? "-5" : "X";

  const strikeArray = makeBy(4, i => {
    const setStrikes = handleClick(strikes, i);
    return (
      <Strike
        key={i}
        value={strikes > i ? showValue : null}
        setStrikes={setStrikes}
      />
    );
  });

  return (
    <div className="flex flex-col flex-wrap content-start h-48 w-32 mr-4">
      {strikeArray}
    </div>
  );
};
