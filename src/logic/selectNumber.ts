import { Square, Color, ReactHook, ButtonClick } from "../types";
import { flow } from "fp-ts/lib/function";
import { findLastIndex } from "fp-ts/lib/Array";
import { lookup } from "fp-ts/lib/Record";
import {
  toNullable,
  none,
  some,
  Option,
  map,
  elem,
  ap
} from "fp-ts/lib/Option";
import { calculateSelected } from "../components/ColorRow";
import { eqBoolean } from "fp-ts/lib/Eq";

const squareIsSelected = ({ isSelected }: Square) => isSelected;

const lastSelectedIndex = flow(findLastIndex(squareIsSelected), toNullable);

const isSelectable = (sq: Square) => {
  return sq.isSelected || sq.isDisabled ? none : some(sq);
};

const optionMatchesBool = (bool: boolean) => (op: Option<boolean>) =>
  elem(eqBoolean);

const optionIsTrue = (op: Option<boolean>) => optionMatchesBool(true);

const optionSquareIsLAst = (x: Option<Square>) => lookup("isLast", x);

const lastIsSelectable = (selectedSquares: number) => {
  return (sq: Option<Square>) => {
    return flow(ap(sq)(optionSquareIsLAst)) && selectedSquares < 5;
  };
};

const curry = <T extends (...args: any) => any>(fn: T) => {
  const arity = fn.length;
  return function $curry(
    ...args: Parameters<T>
  ): ReturnType<T> | ((...args: Parameters<T>[]) => ReturnType<T>) {
    if (args.length < arity) {
      return $curry.bind(null, args);
    }
    return fn.call(null, args);
  };
};

export const selectNumber = (dice: number[]) => {
  const [white1, white2, red, yellow, green, blue] = dice;
  const coloredDice: Record<Color, number> = { red, yellow, green, blue };
  return (squares: Square[], setColor: ReactHook<Square[]>, color: Color) => {
    return (i: number): ButtonClick => () => {
      const selectedSquare = squares[i];
      if (selectedSquare.isDisabled || selectedSquare.isSelected) {
        return;
      }
      if (selectedSquare.isLast && calculateSelected(squares) < 5) {
        return;
      }
      if (
        ![
          white1 + white2,
          coloredDice[color] + white1,
          coloredDice[color] + white2
        ].includes(selectedSquare.value)
      ) {
        return;
      }
      const lastSelected = lastSelectedIndex(squares) || -1;
      const nowDisabled = squares
        .slice(lastSelected + 1, i)
        .map(x => ({ ...x, isDisabled: true }));
      const updatedSquare: Square = { ...squares[i], isSelected: true };
      setColor([
        ...squares.slice(0, lastSelected + 1),
        ...nowDisabled,
        updatedSquare,
        ...squares.slice(i + 1)
      ]);
    };
  };
};
