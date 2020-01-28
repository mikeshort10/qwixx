import React from "react";
import { ButtonClick } from "../types";

type NumberProps = {
  isLocked: boolean;
  color: string;
  lockRow: ButtonClick;
  selfLocked: boolean;
};

export const LockButton: React.FC<NumberProps> = ({
  isLocked,
  color,
  lockRow,
  selfLocked
}) => {
  const colorClass = isLocked
    ? `text-${color}-300`
    : `bg-${color}-300 shadow text-${color}-500 hover:bg-${color}-200 active:bg-${color}-400`;
  return (
    <button
      className={`${colorClass} rounded-full w-10 mx-1 my-2 py-2 px-3`}
      onClick={lockRow}
    >
      <i
        className={`fas fa-${
          isLocked ? (selfLocked ? "lock" : "ban") : "lock-open"
        }`}
      />
    </button>
  );
};
