import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="flex justify-center mb-8">
        <a href="https://vite.dev" target="_blank" className="mx-4">
          <img
            src={viteLogo}
            className="h-24 w-auto transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" className="mx-4">
          <img
            src={reactLogo}
            className="h-24 w-auto transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold tex mb-8">Vite + React</h1>
      <div className="p-8 bg-white/5 rounded-lg shadow-md mb-8">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-4"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit{" "}
          <code className="font-mono bg-slate-800/20 p-1 rounded">
            src/App.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
