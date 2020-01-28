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
    setColor: ReactHook<Square[]>,
    color: Color
  ) => (index: number) => ButtonClick;
  readonly toggleLock: (
    isLocked: boolean
  ) => (
    squares: Square[],
    setColor: ReactHook<Square[]>,
    lockUnlock: () => void
  ) => () => void;
  readonly updateLocked: (color: Color, isLocked: boolean) => () => void;
  locked: Locked;
};

export const Points: React.FC<PointsProps> = ({
  statuses,
  setStatuses,
  setStatusOpen,
  toggleLock,
  updateLocked,
  locked,
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
    const selfLocked = statuses[color][10].isSelected;
    const lockColorRow = toggleLock(locked[color])(
      statusesAtColor,
      setStatusesAtColor,
      toggleLock(locked[color])(
        statusesAtColor,
        setStatusesAtColor,
        updateLocked(color, locked[color])
      )
    );
    return (
      <ColorRow
        key={i}
        color={color}
        statuses={statusesAtColor}
        setStatusAtIndex={setStatusAtIndex}
        lockRow={lockColorRow}
        isLocked={locked[color]}
        selfLocked={selfLocked}
        {...props}
      />
    );
  };
  const colorRows = mapWithIndex(createColorRow)(colorNames);
  return (
    <div className="flex flex-col max-w-2xl rounded shadow">{colorRows}</div>
  );
};
