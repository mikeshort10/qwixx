import React from "react";

type DieProps = {
  value: number;
  color: string;
};

const numberAsString = ["zero", "one", "two", "three", "four", "five", "six"];

export const Die: React.FC<DieProps> = ({ value, color }) => {
  const textColor = color === "white" ? "gray-800" : "";
  const bgColor = color === "white" ? "white" : `${color}-500`;
  const diceSide = numberAsString[value];
  return (
    <div className={`bg-${textColor} rounded p-0 `}>
      <i className={`text-6xl text-${bgColor} fas fa-dice-${diceSide}`} />
    </div>
  );
};
