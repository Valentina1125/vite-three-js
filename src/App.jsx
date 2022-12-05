import { useEffect } from "react";
import load from "./assets/load";
import { objectURLs } from "./assets/constants";

function App() {
  useEffect(() => load(objectURLs.skull), []);
  return (
    <div className="App">
        <canvas id="canvas"></canvas>
        <pre id="info"></pre>
    </div>
  );
}

export default App;
