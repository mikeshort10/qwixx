import { Square, Color, Moves, Locked } from "../types";
import * as A from "fp-ts/lib/Array";
import { geq, ordNumber } from "fp-ts/lib/Ord";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { Predicate, Endomorphism, flow } from "fp-ts/lib/function";
import * as R from "fp-ts/lib/Record";
import { colorNames } from "../components/Points";
import { strictEqual } from "fp-ts/lib/Eq";

export const getTriangularNumber = (n: number): number =>
  n < 1 ? n : n + getTriangularNumber(n - 1);

export const calculateSelected = (squares: Square[]) => {
  const isLast = (i: number) => strictEqual(squares.length - 1, i);
  return A.reduceWithIndex<Square, number>(0, (i, acc, { isSelected }) => {
    const addedPoints = isLast(i) ? 2 : 1;
    return isSelected ? acc + addedPoints : acc;
  })(squares);
};

export const getScoreForRow = flow(calculateSelected, getTriangularNumber);

export const createSquares = (lowToHigh = true) =>
  A.makeBy(
    11,
    (i): Square => ({
      isSelected: false,
      value: lowToHigh ? i + 2 : 12 - i
    })
  );

export const geqNumber = (x: number) => (y: number) => geq(ordNumber)(y, x);

const totalSelected = A.reduce(0, (acc, { isSelected }: Square) =>
  isSelected ? acc + 1 : acc
);

export const rowIsCloseable = (squares: Square[]) => (index: number) =>
  index < squares.length - 1 || pipe(squares, totalSelected, geqNumber(5))
    ? O.some(squares)
    : O.none;

// const isSelectable = ({ isSelected }: Square) => !isSelected;

const isBetweenExc = (end: number) => (start: number) => (n: number) => {
  return start < n && n < end;
};

const getRangeToUpdate = <A>(end: number, predicate: Predicate<A>, as: A[]) =>
  pipe(
    as,
    A.findLastIndex(predicate),
    O.getOrElse(() => -1),
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
    A.mapWithIndex((i, a) => {
      return getRangeToUpdate(end, predicate, as)(i)
        ? modifier({ ...a })
        : { ...a };
    })
  );

// const selectSquare = (square: Square) => ({ ...square, isDisabled: true });

// const modifyWhileUnselected = modifyRightFromIndexWhile(
//   selectSquare,
//   not(isSelectable)
// );

export const trace = <A>(fn?: (x: A) => any) => (x: A) => {
  console.log(fn ? fn(x) : x);
  return x;
};

export const updateSquares = (dice: number[]) => (
  squares: Square[],
  setColor: (newSquares: Square[]) => void
) => {
  return (index: number) => () =>
    pipe(
      index,
      rowIsCloseable(squares),
      // chain(indexIsSelectable(dice)(color, index)),
      // O.map(modifyWhileUnselected(index)),
      O.chain(
        A.modifyAt(index, (a: Square) => ({ ...a, isSelected: !a.isSelected }))
      ),
      O.getOrElse(() => squares),
      setColor
    );
};

// const indexIsSelected = (squares: Square[]) => (index: number) =>
//   pipe(A.lookup(index, squares), O.map(isSelected), O.getOrElse(constFalse));

export const resetColors = (): Record<Color, Square[]> => ({
  red: createSquares(),
  yellow: createSquares(),
  blue: createSquares(false),
  green: createSquares(false)
});

export const last = <A>(arr: A[]): A => arr.slice(-1)[0];

// const disableAllUnselected = A.map((sq: Square) =>
//   sq.isSelected ? sq : { ...sq, isDisabled: true }
// );

// export const lockRow = (
//   squares: Square[],
//   setColor: (newSquares: Square[]) => void,
//   lock: () => void
// ) => () => {
//   pipe(squares, disableAllUnselected, setColor, lock);
// };

// const updateLocked = (lockedColor: Color, isLocked: boolean) => {
//   return () => {
//     stringifyAndSend("closeRow")(lockedColor);
//     setLocked({ ...locked, [lockedColor]: !isLocked });
//   };
// };

const calculatePossibleMoves = (dice: number[]): Moves => {
  const [red, yellow, w1, w2, green, blue] = dice;
  const moves = { red, yellow, green, blue };
  return R.reduceWithIndex(
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
  if (white !== value && color1 !== value && color2 !== value) {
    return O.none;
  }
  return O.fromNullable(squares);
};

// const removeDisabled = (square: Square) => ({ ...square, isDisabled: false });

// const unlockRow = (
//   squares: Square[],
//   setSquares: ReactHook<Square[]>,
//   unlock: () => void
// ) => () =>
//   pipe(
//     squares,
//     // modifyRightFromIndexWhile(removeDisabled, isSelected)(11),
//     setSquares,
//     unlock
//   );

// export const toggleLock = (isLocked: boolean) =>
//   isLocked ? unlockRow : lockRow;

export const stringIsColor = (color: any): color is Color =>
  colorNames.includes(color);

export const selectedInRow = A.reduce(0, (acc, { isSelected }: Square) =>
  isSelected ? acc + 1 : acc
);

// todo: unselect number
// todo: undo last move w/ websockets
// todo: progressive web app
// todo: styling changes for dice, buttons, strikes

export const lockedState = (): Locked => ({
  red: false,
  blue: false,
  green: false,
  yellow: false
});
