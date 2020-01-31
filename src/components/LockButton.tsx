import React from "react";

type NumberProps = {
  isLocked: boolean;
  color: string;
  selfLocked: boolean;
};

export const LockButton: React.FC<NumberProps> = ({
  isLocked,
  color,
  selfLocked
}) => {
  const colorClass = selfLocked
    ? `text-${color}-300`
    : `bg-${color}-300 shadow text-${color}-500 hover:bg-${color}-200 active:bg-${color}-400`;
  return (
    <button className={`${colorClass} rounded-full w-10 mx-1 my-2 py-2 px-3`}>
      <i
        style={{ transform: "rotateZ(45deg)" }}
        className={`fas fa-${
          isLocked ? (selfLocked ? "lock" : "unlock-alt") : "lock-open"
        }`}
      />
    </button>
  );
};
