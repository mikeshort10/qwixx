import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { ColorRow } from "./ColorRow";

const colorNames = ["red", "yellow", "green", "blue"];

type PointsProps = {
  colors: Record<string, boolean[]>;
  setColors: Record<string, React.Dispatch<React.SetStateAction<boolean[]>>>;
};

export const Points: React.FC<PointsProps> = ({ colors, setColors }) => {
  const createColorRow = (i: number, color: string) => (
    <ColorRow
      color={color}
      lowToHigh={i < 2}
      colors={colors[color]}
      setColors={setColors[color]}
    />
  );
  const colorRows = mapWithIndex(createColorRow)(colorNames);
  return <div className="flex flex-col">{colorRows}</div>;
};
