import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { ColorRow } from "./ColorRow";
import { Color, ButtonClick, Square, Locked } from "../types";

export const colorNames: Color[] = ["red", "yellow", "green", "blue"];

type PointsProps = {
  colorRows: Record<Color, Square[]>;
  updateColor: (color: Color) => (newSquares: Square[]) => void;
  showScores: boolean;
  readonly setStatusOpen: (
    colorState: Square[],
    updateColor: (newSquares: Square[]) => void
  ) => (index: number) => ButtonClick;
  locked: Locked;
  toggleLocked: (color: Color) => ButtonClick;
};

export const Points: React.FC<PointsProps> = ({
  colorRows,
  updateColor,
  setStatusOpen,
  locked,
  children,
  toggleLocked,
  ...props
}) => {
  const createColorRow = (i: number, color: Color) => {
    const row = colorRows[color];
    const colorProps = {
      ...props,
      color,
      row,
      setRow: setStatusOpen(row, updateColor(color)),
      selfLocked: row.slice(-1)[0].isSelected,
      toggleLocked: toggleLocked(color),
      isLocked: locked[color]
    };
    return <ColorRow key={i} {...colorProps} />;
  };
  const numberRow = mapWithIndex(createColorRow)(colorNames);
  return <div className="flex flex-col w-full rounded shadow">{numberRow}</div>;
};
