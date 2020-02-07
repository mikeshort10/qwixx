import React from "react";
import { ButtonClick, Square } from "../types";

export type NumberProps = {
  key: number;
  square: Square;
  color: string;
  disabled: boolean;
  setStatus: ButtonClick;
};

export const NumberButton: React.FC<NumberProps> = ({
  square: { isSelected, value },
  color,
  setStatus,
  disabled
}) => {
  const bgContrast = isSelected || disabled ? "500" : "300";
  const textContrast = isSelected || !disabled ? "300" : "500";
  const bgClass = `bg-${color}-${bgContrast} text-${color}-${textContrast}`;
  const colorClass =
    disabled || isSelected
      ? ""
      : `bg-${color}-300 shadow text-${color}-500 hover:bg-${color}-200 active:bg-${color}-400`;
  return (
    <button
      disabled={disabled}
      className={`${colorClass} ${bgClass} font-bold rounded w-10 ml-1 my-2 py-1 px-2`}
      onClick={setStatus}
    >
      {value}
    </button>
  );
};
