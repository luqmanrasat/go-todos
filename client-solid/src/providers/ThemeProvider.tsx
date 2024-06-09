import { ParentComponent, createContext, createEffect, createSignal, useContext } from "solid-js";

export const modes = {
  LIGHT: "light",
  DARK: "dark",
} as const;
type ThemeMode = typeof modes[keyof typeof modes];

const [colorMode, setColorMode] = createSignal("light");
createEffect(() => {
  document.documentElement.dataset.theme = colorMode();
});

const toggleTheme = (): void => {
  if (colorMode() === "dark") {
    setColorMode("light");
    return;
  }

  setColorMode("dark");
};

const theme = [
  colorMode,
  toggleTheme,
] as const;
type ThemeContextType = typeof theme;
const ThemeContext = createContext<ThemeContextType>(theme);

export const ThemeProvider: ParentComponent<{ mode?: ThemeMode }> = (props) => {
  if (props.mode) {
    setColorMode(props.mode)
  }

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
};


export function useTheme() {
  return useContext(ThemeContext);
}