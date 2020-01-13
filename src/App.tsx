import React, { useState } from "react";
import { Points } from "./components/Points";
import { ButtonStatus, ReactHook, DivClick, ButtonClick } from "./types";
import { mapWithIndex } from "fp-ts/lib/Array";
import { Strike } from "./components/Strike";

const createArrayOf = <T,>(length: number, filler: T): T[] =>
  mapWithIndex(() => filler)(Array(length).fill(null));

const selectNumber = (status: ButtonStatus) => (
  colorState: ButtonStatus[],
  setColor: ReactHook<ButtonStatus[]>
) => (index: number): ButtonClick => e => {
  const state: ButtonStatus[] = colorState
    .slice(0, index)
    .concat(status, colorState.slice(index + 1));
  setColor(state);
};

const App: React.FC = () => {
  const [red, setRed] = useState(createArrayOf(11, "open" as ButtonStatus));
  const [yellow, setYellow] = useState(
    createArrayOf(11, "open" as ButtonStatus)
  );
  const [green, setGreen] = useState(createArrayOf(11, "open" as ButtonStatus));
  const [blue, setBlue] = useState(createArrayOf(11, "open" as ButtonStatus));
  const [strikes, setStrikes] = useState(0);

  const colors = { red, yellow, green, blue };
  const setColors = { setRed, setYellow, setGreen, setBlue };

  const setStatusOpen = selectNumber("selected");

  const addStrike: DivClick = e => setStrikes(strikes + 1);

  return (
    <div>
      <Points
        statuses={colors}
        setStatuses={setColors}
        setStatusOpen={setStatusOpen}
      />
      <div className="flex">
        {mapWithIndex((i, value: boolean) => (
          <Strike key={i} value={value} addStrike={addStrike} />
        ))([...Array(strikes).fill(true), ...Array(4 - strikes).fill(false)])}
      </div>
    </div>
  );
};

export default App;
