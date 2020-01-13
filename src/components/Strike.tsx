import React from "react";
import { DivClick } from "../types";

type StrikeProps = {
  value: number;
  addStrike: DivClick;
};

export const Strike: React.FC<StrikeProps> = ({ value, addStrike }) => {
  return (
    <div
      onClick={addStrike}
      className="ml-2 mt-2 h-10 w-10 border rounded border-gray-800 flex justify-center items-center"
    >
      {value || null}
    </div>
  );
};
