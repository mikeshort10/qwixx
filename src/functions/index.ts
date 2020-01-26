import { Square, ReactHook } from "../types";
import {
  makeBy,
  findLastIndex,
  mapWithIndex,
  modifyAt,
  reduce,
  map
} from "fp-ts/lib/Array";
import { geq, ordNumber } from "fp-ts/lib/Ord";
import {
  some,
  none,
  getOrElse,
  chain,
  map as mapOption
} from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { Predicate, Endomorphism, not, flow } from "fp-ts/lib/function";

export const createSquares = (lowToHigh = true): Square[] =>
  makeBy(11, i => ({
    isSelected: false,
    isDisabled: false,
    value: lowToHigh ? i + 2 : 12 - i,
    isLast: i === 10
  }));

const geqNumber = (x: number) => (y: number) => geq(ordNumber)(y, x);

const totalSelected = reduce(0, (acc, { isSelected }: Square) =>
  isSelected ? acc + 1 : acc
);

const rowIsCloseable = (squares: Square[]) => (index: number) =>
  index < squares.length - 1 || pipe(squares, totalSelected, geqNumber(5))
    ? some(squares)
    : none;

const isSelectable = ({ isDisabled, isSelected }: Square) =>
  !isDisabled && !isSelected;

const isBetweenExc = (end: number) => (start: number) => (n: number) => {
  return start < n && n < end;
};

const getRangeToUpdate = <A>(end: number, predicate: Predicate<A>, as: A[]) =>
  pipe(
    as,
    findLastIndex(predicate),
    getOrElse(() => -1),
    isBetweenExc(end)
  );

type MRFIW = <A>(
  modifier: Endomorphism<A>,
  predicate: Predicate<A>
) => (end: number) => (as: A[]) => A[];

const modifyRightFromIndexWhile: MRFIW = (modifier, predicate) => end => as =>
  pipe(
    as,
    mapWithIndex((i, a) => {
      // console.log(getRangeToUpdate(end, predicate, as)(i));
      return getRangeToUpdate(end, predicate, as)(i)
        ? modifier({ ...a })
        : { ...a };
    })
  );

const selectSquare = (square: Square) => ({ ...square, isDisabled: true });

const modifyWhileUnselected = modifyRightFromIndexWhile(
  selectSquare,
  not(isSelectable)
);

const trace = <A>(fn?: (x: A) => any) => (x: A) => {
  console.log(fn ? fn(x) : x);
  return x;
};

export const updateSquares = (
  squares: Square[],
  setColor: ReactHook<Square[]>
) => {
  return (index: number) => () =>
    flow(
      rowIsCloseable(squares),
      mapOption(modifyWhileUnselected(index)),
      chain(modifyAt(index, (a: Square) => ({ ...a, isSelected: true }))),
      getOrElse(() => squares),
      setColor
    )(index);
};

const disableAllUnselected = map((sq: Square) =>
  sq.isSelected ? sq : { ...sq, isDisabled: true }
);

export const lockRow = (
  squares: Square[],
  setColor: ReactHook<Square[]>,
  lockColor: () => void
) => () => pipe(squares, trace(), disableAllUnselected, setColor, lockColor);
