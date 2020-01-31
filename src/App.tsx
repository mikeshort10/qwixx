import React, { useState, useEffect } from "react";
import { Points } from "./components/Points";
import { Color, Locked, Square, ReactHook } from "./types";
import { map } from "fp-ts/lib/Array";
import { Strikes } from "./components/Strike";
import { Dice } from "./components/Die";
import { randomInt } from "fp-ts/lib/Random";
import { createSquares, updateSquares, lockRow } from "./functions";
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

const socket = new WebSocket("ws://0.0.0.0:4000/");

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
      console.log(type);
      switch (type) {
        case "roll":
          setDice(message);
          break;
        case "closeRow":
          console.log(message);
          setLocked(message);
          break;
      }
    };
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
      console.log(updatedColor, "is NOT locked");

      stringifyAndSend("closeRow")(updatedColor);
      setLocked({ ...locked, [updatedColor]: true });
    } else {
      console.log(updatedColor, "is locked");
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
