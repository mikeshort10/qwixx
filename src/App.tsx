import React, { useState } from "react";
import { Points } from "./components/Points";
import { Color, Locked } from "./types";
import { map } from "fp-ts/lib/Array";
import { Strikes } from "./components/Strike";
import { flow } from "fp-ts/lib/function";
import { Dice } from "./components/Die";
import { randomInt } from "fp-ts/lib/Random";
import { createSquares, updateSquares, lockRow } from "./functions";

const lockedState: Locked = {
  red: false,
  blue: false,
  green: false,
  yellow: false
};

// todo: click last number = close row
// todo: undo strikes
// todo: undo close row
// todo: undo last move
// todo: styling changes for dice, buttons, strikes


const App: React.FC = () => {
  const [red, setRed] = useState(createSquares());
  const [yellow, setYellow] = useState(createSquares());
  const [green, setGreen] = useState(createSquares(false));
  const [blue, setBlue] = useState(createSquares(false));
  const [strikes, setStrikes] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [dice, setDice] = useState([1, 2, 3, 4, 5, 6]);
  const [locked, setLocked] = useState(lockedState);

  const toggleShowScores = () => setShowScores(!showScores);

  const colors = { red, yellow, green, blue };
  const setColors = { setRed, setYellow, setGreen, setBlue };

  const rollDice = () => flow(map(randomInt(1, 6)), setDice)(dice);

  const updateLocked = (lockedColor: Color) => () =>
    setLocked({ ...locked, [lockedColor]: true });

  return (
    <div className="w-full h-full bg-gray-300 flex flex-col items-center m-0">
      <Points
        showScores={showScores}
        statuses={colors}
        setStatuses={setColors}
        setStatusOpen={updateSquares}
        lockRow={lockRow}
        updateLocked={updateLocked}
        locked={locked}
      />
      <div className="flex justify-center w-full mt-2">
        <Strikes
          strikes={strikes}
          setStrikes={setStrikes}
          showScores={showScores}
        />
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
