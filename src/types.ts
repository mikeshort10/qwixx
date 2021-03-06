export type Color = "red" | "yellow" | "green" | "blue";

export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;

export type ButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => void;

export type DivClick = (e: React.MouseEvent<HTMLDivElement>) => void;

export type Square = {
  value: number;
  isSelected: boolean;
  // isDisabled: boolean;
  // isLast: boolean;
};

export type Locked = Record<Color, boolean>;

export type FCState<T> = [T, ReactHook<T>];

export type Moves = {
  [color in Color]: [number, number];
} & { white: number };

export type History = Record<Color, Square[]> & {
  dice: number[];
  strikes: number;
  locked: Record<Color, boolean>;
};
