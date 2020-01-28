import React from "react";
import { mapWithIndex, reduce } from "fp-ts/lib/Array";
import { NumberButton } from "./NumberButton";
import { LockButton } from "./LockButton";
import { Color, ButtonClick, Square } from "../types";

const getTriangularNumber = (n: number): number =>
  n < 1 ? n : n + getTriangularNumber(n - 1);

export const calculateSelected = reduce<Square, number>(
  0,
  (acc, { isSelected, isLast }) => {
    const addedPoints = isLast ? 2 : 1;
    return isSelected ? acc + addedPoints : acc;
  }
);

const createNumberButton = (
  color: Color,
  setStatusAtIndex: (i: number) => ButtonClick
) => {
  return (i: number, square: Square): JSX.Element => {
    const setStatus = setStatusAtIndex(i);
    return (
      <NumberButton
        key={i}
        square={square}
        setStatus={setStatus}
        color={color}
      />
    );
  };
};

const createNumberButtonRow = (
  color: Color,
  setStatusAtIndex: (i: number) => ButtonClick
) => mapWithIndex(createNumberButton(color, setStatusAtIndex));

type ColorRowProps = {
  color: Color;
  statuses: Square[];
  showScores: boolean;
  setStatusAtIndex: (index: number) => ButtonClick;
  lockRow: ButtonClick;
  isLocked: boolean;
  selfLocked: boolean;
};

export const ColorRow: React.FC<ColorRowProps> = ({
  color,
  statuses,
  setStatusAtIndex,
  showScores,
  ...lockButtonProps
}) => {
  const createRow = createNumberButtonRow(color, setStatusAtIndex);
  const createNumberRow = createRow;
  const numberRow = createNumberRow(statuses);
  const pointsInRow = getTriangularNumber(calculateSelected(statuses));

  return (
    <div className={`flex justify-center items-stretch bg-${color}-500 px-2`}>
      {numberRow}
      <LockButton color={color} {...lockButtonProps} />
      <div
        className={`well font-mono w-10 flex justify-center items-center text-${color}-100 bg-${color}-600 rounded ml-1 my-2 py-1 px-2 ${
          showScores ? "" : "invisible"
        }`}
      >
        {pointsInRow}
      </div>
    </div>
  );
};
