import * as React from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "../public/index.tsx";
import GPACalculator from "./pages/GPACalculator";
import GradeCalculator from "./pages/GradeCalculator";
import AttendanceCalculator from "./pages/AttendanceCalculator";
import ScheduleMaker from "./pages/ScheduleMaker";
import About from "./pages/About";

const App: React.FC = () => {
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
          <Route path="/grade-calculator" element={<GradeCalculator />} />
          <Route
            path="/attendance-calculator"
            element={<AttendanceCalculator />}
          />
          <Route path="/schedule-maker" element={<ScheduleMaker />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Sidebar>
    </Router>
  );
};

export default App;
