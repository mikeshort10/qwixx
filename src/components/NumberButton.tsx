import React from "react";
import { ButtonClick, Square } from "../types";

type NumberProps = {
  square: Square;
  color: string;
  setStatus: ButtonClick;
};

export const NumberButton: React.FC<NumberProps> = ({
  square: { isSelected, isDisabled, value },
  color,
  setStatus
}) => {
  const bgContrast = isSelected || isDisabled ? "500" : "300";
  const textContrast = isSelected || !isDisabled ? "300" : "500";
  const bgClass = `bg-${color}-${bgContrast} text-${color}-${textContrast}`;
  const colorClass =
    isDisabled || isSelected
      ? ""
      : `bg-${color}-300 shadow text-${color}-500 hover:bg-${color}-200 active:bg-${color}-400`;
  return (
    <button
      disabled={isDisabled}
      className={`${colorClass} ${bgClass} font-bold rounded w-10 ml-1 my-2 py-1 px-2`}
      onClick={setStatus}
    >
      {value}
    </button>
  );
};
