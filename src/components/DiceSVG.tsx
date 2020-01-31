import React from "react";
import { makeBy } from "fp-ts/lib/Array";
import { createDiceMap } from "./Die";

type DotProps = {
  diameter: number;
  fill: string;
  show: boolean;
  cx: number;
  cy: number;
};

const Dot: React.FC<DotProps> = ({ diameter, fill, show, cx, cy }) => {
  const radius = diameter / 2;
  const color = show ? fill : "transparent";
  return (
    <circle
      className={`fill-${color} stroke-${color}`}
      cx={cx}
      cy={cy}
      r={radius}
      strokeWidth="1"
      fill={show ? fill : "transparent"}
    />
  );
};

type DotWrapper = { diameter: number; fill: string };

const DotWrapper = (wrapperProps: DotWrapper) => {
  return (props: Omit<DotProps, keyof DotWrapper>) => {
    return <Dot {...wrapperProps} {...props} />;
  };
};

const getSide = (p: number, ns = 3) => {
  const o = p * 0.2;
  const i = p * 0.01;
  const s = (p - 2 * o - ns * 2 * i) / ns;
  return { s, o, i };
};

const calcXOrY = (p: number, s: number, o: number, i: number) => {
  return (n: number) => {
    return o + i + s / 2 + n * (2 * i + s);
  };
};

type DiceProps = { side: number; dots: number; color: string };

export const DiceSVG: React.FC<DiceProps> = ({ side, dots, color }) => {
  const fill = color === "white" ? "gray-800" : "white";
  const { o, i, s: diameter } = getSide(side);
  const Dot = DotWrapper({ diameter, fill });
  const calcCxCy = calcXOrY(side, diameter, o, i);
  return (
    <div
      className={`overflow-hidden rounded-lg shadow h-${side / 4} w-${side /
        4} mr-2 mb-2`}
    >
      <svg height={side} width={side}>
        <rect height={side} width={side} className={`fill-${color}`}></rect>
        {makeBy(9, i => {
          const props = {
            cx: calcCxCy(i % 3),
            cy: calcCxCy(Math.floor(i / 3)),
            show: createDiceMap[dots](i)
          };
          return <Dot key={i} {...props} />;
        })}
      </svg>
    </div>
  );
};
