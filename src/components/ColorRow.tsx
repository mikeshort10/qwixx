import React from "react";
import { mapWithIndex, reduce, map, chain } from "fp-ts/lib/Array";
import { NumberButton } from "./NumberButton";
import { LockButton } from "./LockButton";
import { flow } from "fp-ts/lib/function";
import { tail } from "fp-ts/lib/NonEmptyArray";

const arrayOf11: null[] = Array(11).fill(null);

const createNumberButton = (color: string) => {
  return (i: number, x: null): JSX.Element => (
    <NumberButton key={i} value={i + 2} color={color} />
  );
};

const createNumberButtonRow = (
  color: string
): ((fa: null[]) => JSX.Element[]) => {
  return mapWithIndex(createNumberButton(color));
};

const reverseElementsHandler = (acc: JSX.Element[], x: JSX.Element) => {
  return [x, ...acc];
};
const reverseElements = reduce([] as JSX.Element[], reverseElementsHandler);

type ColorRowProps = {
  color: string;
  lowToHigh: boolean;
  colors: boolean[];
  setColors: React.Dispatch<React.SetStateAction<boolean[]>>;
};

export const ColorRow: React.FC<ColorRowProps> = ({
  color,
  lowToHigh,
  colors,
  setColors
}) => {
  const createNumberRow = lowToHigh
    ? createNumberButtonRow(color)
    : flow(createNumberButtonRow(color), reverseElements);
  const numberRow = createNumberRow(arrayOf11);
  const isLocked = colors[colors.length - 1];
  return (
    <div className={`flex items-stretch bg-${color}-500`}>
      {numberRow}
      <LockButton color={color} isLocked={isLocked} />
    </div>
  );
};
