import React from "react";
import { ReactHook, DivClick } from "../types";
import { makeBy } from "fp-ts/lib/Array";

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
  const updateStrikes = () => setStrikes(strikes + 1);

  const showValue = showScores ? "5" : "X";

  const strikeArray = makeBy(4, i => (
    <Strike
      key={i}
      value={strikes > i ? showValue : null}
      setStrikes={updateStrikes}
    />
  ));

  return <div className="flex flex-col flex-wrap content-start h-48 w-32 mr-4">{strikeArray}</div>;
};
