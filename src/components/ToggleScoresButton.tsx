import React from "react";

export const ToggleScoresButton: React.FC<{
  toggleShowScores: () => void;
  showScores: boolean;
}> = ({ toggleShowScores, showScores }) => (
  <button
    className="h-16 shadow w-16 bg-gray-800 text-white rounded flex flex-col justify-center items-center"
    onClick={toggleShowScores}
  >
    <span>{showScores ? "Hide" : "Show"}</span>
    <span>Scores</span>
  </button>
);
