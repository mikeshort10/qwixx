import { Square, ReactHook, Color, Moves } from "../types";
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
  map as mapOption,
  fromNullable
} from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { Predicate, Endomorphism, not, flow } from "fp-ts/lib/function";
import { snoc } from "fp-ts/lib/NonEmptyArray";
import { reduceWithIndex } from "fp-ts/lib/Record";
import { colorNames } from "../components/Points";

export const createSquares = (lowToHigh = true): Square[] =>
  pipe(
    makeBy(10, i => ({
      isSelected: false,
      isDisabled: false,
      value: lowToHigh ? i + 2 : 12 - i,
      isLast: false
    })),
    x =>
      snoc(x, {
        isSelected: false,
        isDisabled: false,
        value: lowToHigh ? 12 : 2,
        isLast: true
      })
  );

export const geqNumber = (x: number) => (y: number) => geq(ordNumber)(y, x);

const totalSelected = reduce(0, (acc, { isSelected }: Square) =>
  isSelected ? acc + 1 : acc
);

export const rowIsCloseable = (squares: Square[]) => (index: number) =>
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

export const modifyRightFromIndexWhile: MRFIW = (
  modifier,
  predicate
) => end => as =>
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

export const trace = <A>(fn?: (x: A) => any) => (x: A) => {
  console.log(fn ? fn(x) : x);
  return x;
};

export const updateSquares = (dice: number[]) => (
  squares: Square[],
  setColor: ReactHook<Square[]>,
  color: Color
) => {
  return (index: number) => () =>
    flow(
      rowIsCloseable(squares),
      // chain(indexIsSelectable(dice)(color, index)),
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
  lock: () => void
) => () => {
  pipe(squares, disableAllUnselected, trace(), setColor, lock);
};

// const updateLocked = (lockedColor: Color, isLocked: boolean) => {
//   return () => {
//     stringifyAndSend("closeRow")(lockedColor);
//     setLocked({ ...locked, [lockedColor]: !isLocked });
//   };
// };

const calculatePossibleMoves = (dice: number[]): Moves => {
  const [red, yellow, w1, w2, green, blue] = dice;
  const moves = { red, yellow, green, blue };
  return reduceWithIndex(
    { white: w1 + w2 } as Moves,
    (color, acc, n: number) => ({
      ...acc,
      [color]: [n + w1, n + w2]
    })
  )(moves);
};

export const indexIsSelectable = (dice: number[]) => (
  color: Color,
  index: number
) => (squares: Square[]) => {
  const {
    white,
    [color]: [color1, color2]
  } = calculatePossibleMoves(dice);
  const { value } = squares[index];
  console.log(calculatePossibleMoves(dice));
  if (white !== value && color1 !== value && color2 !== value) {
    return none;
  }
  return fromNullable(squares);
};

const isSelected = ({ isSelected }: Square) => isSelected;

const removeDisabled = (square: Square) => ({ ...square, isDisabled: false });

const unlockRow = (
  squares: Square[],
  setSquares: ReactHook<Square[]>,
  unlock: () => void
) => () =>
  pipe(
    squares,
    modifyRightFromIndexWhile(removeDisabled, isSelected)(11),
    setSquares,
    unlock
  );

export const toggleLock = (isLocked: boolean) =>
  isLocked ? unlockRow : lockRow;

export const stringIsColor = (color: any): color is Color =>
  colorNames.includes(color);

export const selectedInRow = reduce(0, (acc, { isSelected }: Square) =>
  isSelected ? acc + 1 : acc
);
