import React from "react";
import { reduce, mapWithIndex } from "fp-ts/lib/Array";
import { NumberButton } from "./NumberButton";
import { LockButton } from "./LockButton";
import { flow } from "fp-ts/lib/function";
import { ButtonStatus, Color, ButtonClick } from "../types";

const createNumberButton = (
  color: Color,
  setStatusAtIndex: (i: number) => ButtonClick
) => {
  return (i: number, status: ButtonStatus): JSX.Element => {
    const setStatus = setStatusAtIndex(i);
    return (
      <NumberButton
        key={i}
        status={status}
        setStatus={setStatus}
        value={i + 2}
        color={color}
      />
    );
  };
};

const createNumberButtonRow = (
  color: Color,
  setStatusAtIndex: (i: number) => ButtonClick
) => {
  return mapWithIndex(createNumberButton(color, setStatusAtIndex));
};

const reverseElementsHandler = (acc: JSX.Element[], x: JSX.Element) => {
  return [x, ...acc];
};
const reverseElements = reduce([] as JSX.Element[], reverseElementsHandler);

type ColorRowProps = {
  color: Color;
  lowToHigh: boolean;
  statuses: ButtonStatus[];
  setStatusAtIndex: (index: number) => ButtonClick;
};

export const ColorRow: React.FC<ColorRowProps> = ({
  color,
  lowToHigh,
  statuses,
  setStatusAtIndex
}) => {
  const createRow = createNumberButtonRow(color, setStatusAtIndex);
  const createNumberRow = lowToHigh
    ? createRow
    : flow(createRow, reverseElements);
  const numberRow = createNumberRow(statuses);
  const isLocked = statuses[statuses.length - 1] === "selected";
  return (
    <div className={`flex items-stretch bg-${color}-500 mt-1`}>
      {numberRow}
      <LockButton color={color} isLocked={isLocked} />
    </div>
  );
};
