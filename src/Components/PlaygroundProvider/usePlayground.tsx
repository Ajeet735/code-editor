// src/Components/PlaygroundProvider/usePlayground.ts
import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundProvider"; // adjust if needed
import type { PlaygroundContextType } from "./PlaygroundProvider";

export const usePlayground = (): PlaygroundContextType => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error("usePlayground must be used within a PlaygroundProvider");
  }
  return context;
};
