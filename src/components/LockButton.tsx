import React from "react";

type NumberProps = {
  isLocked: boolean;
  color: string;
};

export const LockButton: React.FC<NumberProps> = ({ isLocked, color }) => {
  return (
    <button
      className={`bg-${color}-300 rounded-full text-${color}-500 w-10 mx-1 my-2 hover:bg-${color}-200 active:bg-${color}-400 py-2 px-3`}
    >
      {isLocked ? "X" : "L"}
    </button>
  );
};
