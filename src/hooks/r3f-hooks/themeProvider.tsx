import { createContext, useState } from "react";

interface ThemeContext {
  color: string;
  setColor: (color: string) => void;
}
export const ThemeContext = createContext<ThemeContext>({
  color: "white",
  setColor: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [color, setColor] = useState("white");
  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
