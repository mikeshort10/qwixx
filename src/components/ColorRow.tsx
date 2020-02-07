import React from "react";
import { NumberButton, NumberProps } from "./NumberButton";
import { LockButton } from "./LockButton";
import { Color, ButtonClick, Square } from "../types";
import { getScoreForRow } from "../functions";

export const ScoreWell: React.FC<{
  showScores: boolean;
  color?: Color;
  points: number;
}> = ({ showScores, color, points }) => {
  const visibility = showScores ? "" : "invisible";
  const bgColor = color || "gray";
  return (
    <div
      className={`well font-mono w-10 flex justify-center items-center text-${bgColor}-100 bg-${bgColor}-600 rounded ml-1 my-2 py-1 px-2 ${visibility}`}
    >
      {points}
    </div>
  );
};

const getRow = (color: Color, setStatus: (i: number) => ButtonClick) => {
  let isLast = true;
  return function $rec(sqs: Square[], disabled: boolean): JSX.Element[] {
    const index = sqs.length - 1;
    if (index === -1) {
      return [];
    }
    const square = sqs[index];
    const disabledByIndex = isLast && square.isSelected ? false : disabled;
    const props: NumberProps = {
      key: index,
      square,
      color,
      disabled: disabledByIndex,
      setStatus: setStatus(index)
    };
    if (index === 0) {
      return [<NumberButton {...props} />];
    }
    isLast = false;
    return [
      ...$rec(sqs.slice(0, index), disabled || square.isSelected),
      <NumberButton {...props} />
    ];
  };
};

type ColorRowProps = {
  color: Color;
  row: Square[];
  showScores: boolean;
  setRow: (index: number) => ButtonClick;
  isLocked: boolean;
  selfLocked: boolean;
  toggleLocked: ButtonClick;
};

export const ColorRow: React.FC<ColorRowProps> = ({
  color,
  row,
  setRow,
  showScores,
  children,
  isLocked,
  ...lockButtonProps
}) => {
  const numberRow = getRow(color, setRow)(row, isLocked);
  const points = getScoreForRow(row);

  return (
    <div className={`flex w-full justify-around bg-${color}-500 px-2`}>
      {numberRow}
      <LockButton color={color} isLocked={isLocked} {...lockButtonProps} />
      <ScoreWell color={color} showScores={showScores} points={points} />
    </div>
  );
};
