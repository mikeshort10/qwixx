import React from "react";
import { ButtonClick } from "../types";

type NumberProps = {
  isLocked: boolean;
  color: string;
  selfLocked: boolean;
  toggleLocked: ButtonClick;
};

export const LockButton: React.FC<NumberProps> = ({
  isLocked,
  color,
  selfLocked,
  toggleLocked
}) => {
  const colorClass = selfLocked
    ? `text-${color}-300`
    : `bg-${color}-300 shadow text-${color}-500 hover:bg-${color}-200 active:bg-${color}-400`;
  return (
    <button
      disabled={selfLocked}
      onClick={toggleLocked}
      className={`${colorClass} rounded-full w-10 mx-1 my-2 py-2 px-3`}
    >
      <i
        style={{ transform: "rotateZ(45deg)" }}
        className={`fas fa-${
          selfLocked ? "lock" : isLocked ? "unlock-alt" : "lock-open"
        }`}
      />
    </button>
  );
};
