import { useEffect } from "react";
import load from "./assets/load";
import { objectURLs } from "./assets/constants";

function App() {
  useEffect(() => load(objectURLs.brazo), []);
  return (
    <div className="App">
        <canvas id="canvas"></canvas>
    </div>
  );
}

export default App;
