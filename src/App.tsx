import React, { useState } from "react";
import { Points } from "./components/Points";

const colorState = (): boolean[] => Array(11).fill(false);

const App: React.FC = () => {
  const [red, setRed] = useState(colorState());
  const [yellow, setYellow] = useState(colorState());
  const [green, setGreen] = useState(colorState());
  const [blue, setBlue] = useState(colorState());

  const colors = { red, yellow, green, blue };
  const setColors = { setRed, setYellow, setGreen, setBlue };

  return (
    <div>
      <Points colors={colors} setColors={setColors} />
    </div>
  );
};

export default App;
