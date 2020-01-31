import React, { useState, useEffect } from "react";
import { Points } from "./components/Points";
import { Color, Locked, Square, ReactHook } from "./types";
import { map, mapWithIndex } from "fp-ts/lib/Array";
import { Strikes } from "./components/Strike";
import { Dice } from "./components/Die";
import { randomInt } from "fp-ts/lib/Random";
import {
  createSquares,
  updateSquares,
  lockRow,
  geqNumber,
  stringIsColor,
  selectedInRow
} from "./functions";
import { pipe } from "fp-ts/lib/pipeable";

// todo: unselect number
// todo: undo last move w/ websockets
// todo: progressive web app
// todo: styling changes for dice, buttons, strikes

const lockedState = (): Locked => ({
  red: false,
  blue: false,
  green: false,
  yellow: false
});

// const copySquares = map((sq: Square) => ({ ...sq }));

const socket = new WebSocket(`ws://${window.location.hostname}:4000/`);

let sendMessage = (x: string) => {};
let stringifyAndSend = (type: string) => <M,>(message: M) => {
  sendMessage(JSON.stringify({ type, message }));
  return message;
};

const App: React.FC = () => {
  const [red, setRed] = useState(createSquares());
  const [yellow, setYellow] = useState(createSquares());
  const [green, setGreen] = useState(createSquares(false));
  const [blue, setBlue] = useState(createSquares(false));
  const [strikes, setStrikes] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [dice, setDice] = useState([1, 2, 3, 4, 5, 6]);
  const [locked, setLocked] = useState(lockedState);
  // const [history, setHistory] = useState([] as History[]);
  // const [historyIndex, setHistoryIndex] = useState(0);

  const [socketConnected, setSocketConnected] = useState(false);

  const colors: Record<Color, [Square[], ReactHook<Square[]>]> = {
    red: [red, setRed],
    yellow: [yellow, setYellow],
    green: [green, setGreen],
    blue: [blue, setBlue]
  };

  // useEffect(() => {
  //   setHistory([
  //     ...history,
  //     {
  //       red: copySquares(red),
  //       yellow: copySquares(yellow),
  //       green: copySquares(green),
  //       blue: copySquares(blue),
  //       locked: { ...locked },
  //       strikes,
  //       dice: [...dice]
  //     }
  //   ]);
  //   // setHistoryIndex(historyIndex + 1)
  // }, [red, yellow, green, blue, locked, strikes, dice]);

  useEffect(() => {
    socket.onopen = () => {
      setSocketConnected(true);
      sendMessage = (message: string) => socket.send(message);
    };

    socket.onmessage = ({ data }) => {
      const { type, message } = JSON.parse(data);
      switch (type) {
        case "roll":
          console.log("received", type, message);
          setDice(message);
          break;
        case "newGame":
          if (message.red === undefined) {
            break;
          }
          setLocked(message);
          setRed(createSquares());
          setYellow(createSquares());
          setGreen(createSquares(false));
          setBlue(createSquares(false));
          break;
        case "closeRow":
          const { color, locked } = message;
          console.log(message);
          if (stringIsColor(color)) {
            console.log(color);
            const [colorRow, setColor] = colors[color];
            const enoughSelected = pipe(colorRow, selectedInRow, geqNumber(5));
            if (enoughSelected) {
              console.log(enoughSelected);
              // eslint-disable-next-line no-restricted-globals
              const selectLastInRow = confirm(
                `A player has chosen to close ${color}. Would you like to close this row as well?`
              );
              const updatedSquares = mapWithIndex((i, sq: Square) => {
                if (sq.isLast) {
                  return { ...sq, isSelected: selectLastInRow };
                }
                return sq.isSelected ? sq : { ...sq, isDisabled: true };
              });
              setColor(updatedSquares);
            }
          }
          setLocked(locked);
          break;
      }
    };
  });

  useEffect(() => {
    return () => {
      stringifyAndSend("leftGame")("");
      socket.close();
    };
  }, []);

  const toggleShowScores = () => setShowScores(!showScores);

  const rollDice = () => {
    pipe(dice, map(randomInt(1, 6)), stringifyAndSend("roll"), setDice);
  };

  const last = <A,>(arr: A[]): A => arr.slice(-1)[0];

  useEffect(() => {
    const updatedColor = (["red", "yellow", "green", "blue"] as Color[]).find(
      (color: Color) => {
        const { isSelected, isDisabled } = last(colors[color][0]);
        return (isSelected || isDisabled) !== locked[color];
      }
    );
    if (!updatedColor) {
      return;
    }
    if (locked[updatedColor] === false) {
      stringifyAndSend("closeRow")(updatedColor);
      setLocked({ ...locked, [updatedColor]: true });
    } else {
      const [colorRow, setColor] = colors[updatedColor];
      lockRow(colorRow, setColor, () => {})();
    }
  }, [locked, colors]);

  const setStatusOpen = updateSquares(dice);

  // const getPast = ({
  //   red,
  //   yellow,
  //   green,
  //   blue,
  //   locked,
  //   strikes,
  //   dice
  // }: History) => {
  //   setRed(red);
  //   setYellow(yellow);
  //   setBlue(blue);
  //   setGreen(green);
  //   setBlue(blue);
  //   setLocked(locked);
  //   setStrikes(strikes);
  //   setDice(dice);
  // };

  // const undo = flow(getPast);

  return (
    <div className="rotate flex flex-col items-start md:items-center md:mx-auto md:max-w-2xl h-144">
      <Points
        showScores={showScores}
        statesAndHooks={colors}
        setStatusOpen={setStatusOpen}
        locked={locked}
      />
      <div className="flex justify-between mt-2 w-full">
        <Strikes
          strikes={strikes}
          setStrikes={setStrikes}
          showScores={showScores}
        />
        <button onClick={() => stringifyAndSend("newGame")("")}>
          New Game
        </button>
        <p>{socketConnected ? "Socket connected" : "Socket not connected"}</p>
        <Dice
          dice={dice}
          rollDice={rollDice}
          showScores={showScores}
          toggleShowScores={toggleShowScores}
        />
      </div>
    </div>
  );
};

export default App;
