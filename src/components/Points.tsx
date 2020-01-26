import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { ColorRow } from "./ColorRow";
import { ReactHook, Color, ButtonClick, Square, Locked } from "../types";

export const colorNames: Color[] = ["red", "yellow", "green", "blue"];
const getHookName = (color: Color): string =>
  `set${color[0].toUpperCase()}${color.slice(1)}`;

type PointsProps = {
  statuses: Record<Color, Square[]>;
  setStatuses: Record<string, ReactHook<Square[]>>;
  showScores: boolean;
  readonly setStatusOpen: (
    colorState: Square[],
    setColor: ReactHook<Square[]>
  ) => (index: number) => ButtonClick;
  readonly lockRow: (
    squares: Square[],
    setColor: ReactHook<Square[]>,
    lockColor: () => void
  ) => () => void;
  readonly updateLocked: (color: Color) => () => void;
  locked: Locked;
};

export const Points: React.FC<PointsProps> = ({
  statuses,
  setStatuses,
  setStatusOpen,
  lockRow,
  updateLocked,
  locked,
  ...props
}) => {
  const createColorRow = (i: number, color: Color) => {
    const statusesAtColor = statuses[color];
    const setStatusesAtColor = setStatuses[getHookName(color)];
    const setStatusAtIndex = setStatusOpen(statusesAtColor, setStatusesAtColor);
    const lockColorRow = lockRow(
      statusesAtColor,
      setStatusesAtColor,
      updateLocked(color)
    );
    return (
      <ColorRow
        key={i}
        color={color}
        statuses={statusesAtColor}
        setStatusAtIndex={setStatusAtIndex}
        lockRow={lockColorRow}
        isLocked={locked[color]}
        {...props}
      />
    );
  };
  const colorRows = mapWithIndex(createColorRow)(colorNames);
  return <div className="flex flex-col max-w-2xl rounded shadow">{colorRows}</div>;
};
