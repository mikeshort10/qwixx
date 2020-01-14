import React from "react";
import { mapWithIndex, reduce } from "fp-ts/lib/Array";
import { NumberButton } from "./NumberButton";
import { LockButton } from "./LockButton";
import { Color, ButtonClick } from "../types";
import { Square } from "../types";

const points = [0, 1, 3, 10, 15, 21, 28, 36, 45, 55, 66, 78];

export const calculateSelected = reduce<Square, number>(
  0,
  (acc, { isSelected }) => (isSelected ? acc + 1 : acc)
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
) => {
  return mapWithIndex(createNumberButton(color, setStatusAtIndex));
};

type ColorRowProps = {
  color: Color;
  statuses: Square[];
  showScores: boolean;
  setStatusAtIndex: (index: number) => ButtonClick;
};

export const ColorRow: React.FC<ColorRowProps> = ({
  color,
  statuses,
  setStatusAtIndex,
  showScores
}) => {
  const createRow = createNumberButtonRow(color, setStatusAtIndex);
  const createNumberRow = createRow;
  const numberRow = createNumberRow(statuses);
  const isLocked = statuses[statuses.length - 1].isSelected;
  const pointsInRow = points[calculateSelected(statuses) + (isLocked ? 1 : 0)];

  return (
    <div className={`flex items-stretch bg-${color}-500 mt-1 h-full`}>
      {numberRow}
      <LockButton color={color} isLocked={isLocked} />
      <div
        className={`h-full w-10 flex justify-center items-center text-white ${
          showScores ? "" : "hidden"
        }`}
      >
        {pointsInRow}
      </div>
    </div>
  );
};
