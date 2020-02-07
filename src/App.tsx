import React, { useState, useEffect, useCallback } from "react";
import { Points } from "./components/Points";
import { Color, Square } from "./types";
import { map } from "fp-ts/lib/Array";
import { AdditionalFields } from "./components/AdditionalFields";
import { randomInt } from "fp-ts/lib/Random";
import {
  updateSquares,
  lockedState,
  last,
  resetColors,
  getScoreForRow
} from "./functions";
import { pipe } from "fp-ts/lib/pipeable";
import { reduce } from "fp-ts/lib/Record";

const socket = new WebSocket(`ws://${window.location.hostname}:4000/`);

let sendMessage = (x: string) => {};
let stringifyAndSend = (type: string) => <M,>(message: M) => {
  sendMessage(JSON.stringify({ type, message }));
  return message;
};

const App: React.FC = () => {
  const [colorRows, setColorRows] = useState(resetColors);
  const [strikes, setStrikes] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [dice, setDice] = useState([1, 2, 3, 4, 5, 6]);
  const [locked, setLocked] = useState(lockedState);
  // const [socketConnected, setSocketConnected] = useState(false);

  const updateColor = useCallback(
    (color: Color) => (newSquares: Square[]) => {
      setColorRows({ ...colorRows, [color]: newSquares });
    },
    [colorRows]
  );

  const toggleShowScores = () => setShowScores(!showScores);

  useEffect(() => {
    socket.onopen = () => {
      // setSocketConnected(true);
      sendMessage = (message: string) => socket.send(message);
    };

    socket.onmessage = ({ data }) => {
      const { type, message } = JSON.parse(data);
      switch (type) {
        case "roll":
          setDice(message);
          break;
        //   case "newGame":
        //     if (message === undefined) {
        //       break;
        //     }
        //     sessionStorage.removeItem("colors");
        //     setLocked(message);
        //     break;
      }
    };
  });

  useEffect(() => {
    const savedColors = sessionStorage.getItem("colors");
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setColorRows(colors);
    }
    return () => {
      stringifyAndSend("leftGame")("");
      socket.close();
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("colors", JSON.stringify(colorRows));
  }, [colorRows]);

  const rollDice = () => {
    pipe(dice, map(randomInt(1, 6)), stringifyAndSend("roll"), setDice);
  };

  useEffect(() => {
    const updatedColor = (["red", "yellow", "green", "blue"] as Color[]).find(
      (color: Color) => {
        const { isSelected } = last(colorRows[color]);
        return isSelected === true && locked[color] === false;
      }
    );
    if (!updatedColor) {
      return;
    }
    if (locked[updatedColor] === false) {
      stringifyAndSend("closeRow")(updatedColor);
    }

    // setLocked({ ...locked, [updatedColor]: !locked[updatedColor] });
  }, [locked, colorRows]);

  const setStatusOpen = updateSquares(dice);

  const toggleLocked = (color: Color) => () => {
    setLocked({ ...locked, [color]: !locked[color] });
  };

  const totalPoints = reduce(
    0,
    (acc, row: Square[]) => acc + getScoreForRow(row)
  )(colorRows);

  const newGame = () => {
    setColorRows(resetColors);
    setLocked({ red: false, yellow: false, green: false, blue: false });
    setStrikes(0);
    // return stringifyAndSend("newGame")("");
  };

  return (
    <div
      className={`rotate flex flex-col items-start md:items-center md:mx-auto md:max-w-2xl h-144`}
    >
      <Points
        showScores={showScores}
        colorRows={colorRows}
        updateColor={updateColor}
        setStatusOpen={setStatusOpen}
        locked={locked}
        toggleLocked={toggleLocked}
      />
      <AdditionalFields
        newGame={newGame}
        showScores={showScores}
        strikes={strikes}
        setStrikes={setStrikes}
        setColorRows={setColorRows}
        stringifyAndSend={stringifyAndSend}
        dice={dice}
        rollDice={rollDice}
        toggleShowScores={toggleShowScores}
        totalPoints={totalPoints}
      />
    </div>
  );
};

export default App;

//   case "closeRow":
//     const { color, locked: newLocked } = message;
//     console.log(message);
//     if (stringIsColor(color)) {
//       console.log(color);
//       const [colorRow, setColor] = colors[color];
//       const enoughSelected = pipe(colorRow, selectedInRow, geqNumber(5));
//       if (enoughSelected) {
//         console.log(enoughSelected);
//         // eslint-disable-next-line no-restricted-globals
//         const selectLastInRow = confirm(
//           `A player has chosen to close ${color}. Would you like to close this row as well?`
//         );
//         const updatedSquares = mapWithIndex((i, sq: Square) => {
//           if (sq.isLast) {
//             return { ...sq, isSelected: selectLastInRow };
//           }
//           return sq.isSelected ? sq : { ...sq, isDisabled: true };
//         });
//         setColor(updatedSquares);
//       }
//     }
//     setLocked(newLocked);
//     break;
