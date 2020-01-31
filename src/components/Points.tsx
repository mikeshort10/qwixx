import React from "react";
import { mapWithIndex } from "fp-ts/lib/Array";
import { ColorRow } from "./ColorRow";
import { ReactHook, Color, ButtonClick, Square, Locked } from "../types";

export const colorNames: Color[] = ["red", "yellow", "green", "blue"];

type PointsProps = {
  statesAndHooks: Record<Color, [Square[], ReactHook<Square[]>]>;
  showScores: boolean;
  readonly setStatusOpen: (
    colorState: Square[],
    setColor: ReactHook<Square[]>,
    color: Color
  ) => (index: number) => ButtonClick;
  locked: Locked;
};

export const Points: React.FC<PointsProps> = ({
  statesAndHooks,
  setStatusOpen,
  locked,
  children,
  ...props
}) => {
  const createColorRow = (i: number, color: Color) => {
    const [statusesAtColor, setStatusesAtColor] = statesAndHooks[color];
    const setStatusAtIndex = setStatusOpen(
      statusesAtColor,
      setStatusesAtColor,
      color
    );
    const selfLocked = statusesAtColor[10].isSelected;
    return (
      <ColorRow
        key={i}
        color={color}
        statuses={statusesAtColor}
        setStatusAtIndex={setStatusAtIndex}
        isLocked={locked[color]}
        selfLocked={selfLocked}
        {...props}
      />
    );
  };
  const colorRows = mapWithIndex(createColorRow)(colorNames);
  return <div className="flex flex-col w-full rounded shadow">{colorRows}</div>;
};
