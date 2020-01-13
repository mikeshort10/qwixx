export type Color = "red" | "yellow" | "green" | "blue";

export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;

export type ButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => void;

export type DivClick = (e: React.MouseEvent<HTMLDivElement>) => void;
