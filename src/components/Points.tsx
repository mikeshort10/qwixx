import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { ColorRow } from "./ColorRow";
import { ButtonStatus, ReactHook, Color, ButtonClick } from "../types";

const colorNames: Color[] = ["red", "yellow", "green", "blue"];
const getHookName = (color: Color): string =>
  `set${color[0].toUpperCase()}${color.slice(1)}`;

type PointsProps = {
  statuses: Record<Color, ButtonStatus[]>;
  setStatuses: Record<string, ReactHook<ButtonStatus[]>>;
  setStatusOpen(
    colorState: ButtonStatus[],
    setColor: ReactHook<ButtonStatus[]>
  ): (index: number) => ButtonClick;
};

export const Points: React.FC<PointsProps> = ({
  statuses,
  setStatuses,
  setStatusOpen
}) => {
  const createColorRow = (i: number, color: Color) => {
    const statusesAtColor = statuses[color];
    const setStatusesAtColor = setStatuses[getHookName(color)];
    const setStatusAtIndex = setStatusOpen(statusesAtColor, setStatusesAtColor);
    return (
      <ColorRow
        key={i}
        color={color}
        lowToHigh={i < 2}
        statuses={statusesAtColor}
        setStatusAtIndex={setStatusAtIndex}
      />
    );
  };
  const colorRows = mapWithIndex(createColorRow)(colorNames);
  return <div className="flex flex-col">{colorRows}</div>;
};
