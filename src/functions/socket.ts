// type SocketMessageParams = {
//   setLocked: ReactHook<Record<Color, boolean>>;
//   setRed: ReactHook<Square[]>;
//   setYellow: ReactHook<Square[]>;
//   setGreen: ReactHook<Square[]>;
//   setBlue: ReactHook<Square[]>;
//   setDice: ReactHook<number[]>;
//   colors: Record<Color, [Square[], ReactHook<Square[]>]>;
// };

// export const socketMessage = ({
//   setLocked,
//   setRed,
//   setYellow,
//   setGreen,
//   setBlue,
//   setDice,
//   colors
// }: SocketMessageParams) => ({ data }: { data: string }) => {
//   const { type, message } = JSON.parse(data);
//   switch (type) {
//     case "roll":
//       setDice(message);
//       break;
//     case "newGame":
//       if (message.locked === undefined) {
//         break;
//       }
//       sessionStorage.removeItem("colors");
//       setLocked(message);
//       setRed(createSquares());
//       setYellow(createSquares());
//       setGreen(createSquares(false));
//       setBlue(createSquares(false));
//       break;
//     case "closeRow":
//       const { color, locked } = message;
//       console.log(message);
//       if (stringIsColor(color)) {
//         console.log(color);
//         const [colorRow, setColor] = colors[color];
//         const enoughSelected = pipe(colorRow, selectedInRow, geqNumber(5));
//         if (enoughSelected) {
//           console.log(enoughSelected);
//           // eslint-disable-next-line no-restricted-globals
//           const selectLastInRow = confirm(
//             `A player has chosen to close ${color}. Would you like to close this row as well?`
//           );
//           const updatedSquares = (sqs: Square[]) => {
//             const isLast = (i: number) => strictEqual(i, sqs.length - 1);
//             return mapWithIndex((i, sq: Square) => {
//               if (isLast(i)) {
//                 return { ...sq, isSelected: selectLastInRow };
//               }
//               return sq.isSelected ? sq : { ...sq, isDisabled: true };
//             });
//           };
//           setColor(updatedSquares(squares));
//         }
//       }
//       setLocked(locked);
//       break;
//   }
// };

export {};
