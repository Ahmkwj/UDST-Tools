import * as React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "./components/Sidebar";
import GPACalculator from "./pages/GPACalculator";
import GradeCalculator from "./pages/GradeCalculator";
import AttendanceCalculator from "./pages/AttendanceCalculator";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Guide from "./pages/Guide";
import SchedulePlanner from "./pages/SchedulePlanner";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";
import { LanguageProvider, useLocale } from "./context/LanguageContext";
import Home from "..";
import FeesManager from "./pages/FeesManager";
import RamadanScheduleMaker from "./pages/RamadanScheduleMaker";

/**
 * Strips any leftover /en or /ar prefix from URLs so old bookmarks still work.
 */
function LegacyLocaleRedirect() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const match = pathname.match(/^\/(en|ar)(\/.*)?$/);
    if (match) {
      const target = match[2] || "/";
      navigate(target, { replace: true });
    }
  }, [pathname, navigate]);

  return null;
}

function LocalizedLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [isRTL, locale]);

  return <div className="font-sans">{children}</div>;
}

const LocalizedApp = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <LocalizedLayout>
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath}>
        <LegacyLocaleRedirect />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/ramadan-schedule" element={<RamadanScheduleMaker />} />
          <Route path="/links" element={<Links />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/gpa-calculator" element={<GPACalculator />} />
          <Route path="/grade-calculator" element={<GradeCalculator />} />
          <Route
            path="/attendance-calculator"
            element={<AttendanceCalculator />}
          />
          <Route path="/schedule-planner" element={<SchedulePlanner />} />
          <Route path="/fees-manager" element={<FeesManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Sidebar>
    </LocalizedLayout>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    document.body.style.fontFamily = '"IBM Plex Sans Arabic", sans-serif';
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <LocalizedApp />
        <Analytics />
      </Router>
    </LanguageProvider>
  );
};

export default App;
