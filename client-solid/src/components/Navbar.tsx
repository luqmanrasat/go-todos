import { Component } from "solid-js";
import { modes, useTheme } from "../providers/ThemeProvider";
import solidLogo from "../assets/solid.svg";
import goLogo from "../assets/go.png";
import explodeIcon from "../assets/explode.png";
import { IoMoon, IoSunny } from "solid-icons/io";

const Navbar: Component = () => {
  const [colorMode, toggleTheme] = useTheme();

  return (
    <div class="navbar bg-base-100 justify-between max-w-[900px] mx-auto">
      <div class="flex items-center justify-center gap-3">
        <img class="w-12 h-12" src={solidLogo} alt="logo" />
        <p class="text-4xl">+</p>
        <img class="w-10" src={goLogo} alt="logo" />
        <p class="text-4xl">+</p>
        <img class="w-12 h-12" src={explodeIcon} alt="logo" />
      </div>
      <div class="flex items-center gap-3">
        <p class="text-lg font-medium">Daily Tasks</p>
        <button class="btn btn-outline" onClick={toggleTheme}>
          {colorMode() === modes.LIGHT ? <IoMoon /> : <IoSunny />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;