import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import GPACalculator from "./pages/GPACalculator";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <Router>
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gpa-calculator" element={<GPACalculator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;
