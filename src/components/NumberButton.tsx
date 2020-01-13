import React from "react";
import { ButtonStatus, ButtonClick } from "../types";

type NumberProps = {
  status: ButtonStatus;
  value: number;
  color: string;
  setStatus: ButtonClick;
};

export const NumberButton: React.FC<NumberProps> = ({
  status,
  value,
  color,
  setStatus
}) => {
  const displayValue = status === "selected" ? "X" : value;
  const eventColorClass = `hover:bg-${color}-200 active:bg-${color}-400`;
  const selected = status === "selected" ? `text-white` : `text-${color}-500`;
  return (
    <button
      disabled={status === "disabled"}
      className={`bg-${color}-300 font-bold ${eventColorClass} rounded w-10 ml-1 my-2 py-1 px-2 ${selected}`}
      onClick={setStatus}
    >
      {displayValue}
    </button>
  );
};
