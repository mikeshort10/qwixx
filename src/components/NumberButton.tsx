import React from "react";

type NumberProps = {
  value: number;
  color: string;
};

export const NumberButton: React.FC<NumberProps> = ({ value, color }) => {
  return (
    <button
      className={`bg-${color}-300 text-${color}-500 rounded w-10 mx-1 my-2 hover:bg-${color}-200 active:bg-${color}-400 py-2 px-3`}
    >
      {value}
    </button>
  );
};
