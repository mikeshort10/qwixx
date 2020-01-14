import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { ColorRow } from "./ColorRow";
import { ReactHook, Color, ButtonClick } from "../types";
import { Square } from "../types";

export const colorNames: Color[] = ["red", "yellow", "green", "blue"];
const getHookName = (color: Color): string =>
  `set${color[0].toUpperCase()}${color.slice(1)}`;

type PointsProps = {
  statuses: Record<Color, Square[]>;
  setStatuses: Record<string, ReactHook<Square[]>>;
  showScores: boolean;
  readonly setStatusOpen: (
    colorState: Square[],
    setColor: ReactHook<Square[]>,
    color: Color
  ) => (index: number) => ButtonClick;
};

export const Points: React.FC<PointsProps> = ({
  statuses,
  setStatuses,
  setStatusOpen,
  ...props
}) => {
  const createColorRow = (i: number, color: Color) => {
    const statusesAtColor = statuses[color];
    const setStatusesAtColor = setStatuses[getHookName(color)];
    const setStatusAtIndex = setStatusOpen(
      statusesAtColor,
      setStatusesAtColor,
      color
    );
    return (
      <ColorRow
        key={i}
        color={color}
        statuses={statusesAtColor}
        setStatusAtIndex={setStatusAtIndex}
        {...props}
      />
    );
  };
  const colorRows = mapWithIndex(createColorRow)(colorNames);
  return <div className="flex flex-col">{colorRows}</div>;
};
