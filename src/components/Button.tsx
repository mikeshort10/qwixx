import React from "react";
import { ButtonClick } from "../types";

type ButtonProps = { onClick: ButtonClick };

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
  <button
    className="mr-2 mb-2 h-16 shadow w-16 bg-gray-800 text-white rounded flex flex-col justify-center items-center"
    onClick={onClick}
  >
    {children}
  </button>
);
