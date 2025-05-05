import * as React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import GPACalculator from "./pages/GPACalculator";
import GradeCalculator from "./pages/GradeCalculator";
import AttendanceCalculator from "./pages/AttendanceCalculator";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Guide from "./pages/Guide";
import ScheduleMaker from "./pages/ScheduleMaker";
import Feedback from "./pages/Feedback";
import Links from "./pages/Links";
import {
  LanguageProvider,
  useLocale,
  useSetLocale,
} from "./context/LanguageContext";
import Home from "../public";

// Redirect component to handle locale in routes
function LocaleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const setLocale = useSetLocale();
  const path = location.pathname;

  useEffect(() => {
    // If already has locale prefix, don't redirect
    if (path.match(/^\/(en|ar)(\/|$)/)) {
      // Extract locale from URL and update context
      const match = path.match(/^\/(en|ar)/);
      if (match && match[1]) {
        setLocale(match[1] as "en" | "ar");
      }
      return;
    }

    // Get preferred locale from localStorage or default to English
    const savedLocale = localStorage.getItem("locale");
    const preferredLocale =
      savedLocale === "en" || savedLocale === "ar" ? savedLocale : "en";

    // Redirect to path with preferred locale
    const targetPath =
      path === "/" ? `/${preferredLocale}` : `/${preferredLocale}${path}`;
    navigate(targetPath, { replace: true });
    setLocale(preferredLocale as "en" | "ar");
  }, [path, navigate, setLocale]);

  return null;
}

// Wrapper component to apply RTL direction based on locale
function LocalizedLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Set the HTML dir attribute based on the locale
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [isRTL, locale]);

  return <div className="font-sans">{children}</div>;
}

const LocalizedApp = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Update currentPath when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <LocalizedLayout>
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath}>
        <Routes>
          {/* Home routes */}
          <Route path="/en" element={<Home />} />
          <Route path="/ar" element={<Home />} />

          {/* GPA Calculator routes */}
          <Route path="/en/gpa-calculator" element={<GPACalculator />} />
          <Route path="/ar/gpa-calculator" element={<GPACalculator />} />

          {/* Grade Calculator routes */}
          <Route path="/en/grade-calculator" element={<GradeCalculator />} />
          <Route path="/ar/grade-calculator" element={<GradeCalculator />} />

          {/* Attendance Calculator routes */}
          <Route
            path="/en/attendance-calculator"
            element={<AttendanceCalculator />}
          />
          <Route
            path="/ar/attendance-calculator"
            element={<AttendanceCalculator />}
          />

          {/* Schedule Maker routes */}
          <Route path="/en/schedule-maker" element={<ScheduleMaker />} />
          <Route path="/ar/schedule-maker" element={<ScheduleMaker />} />

          {/* Calendar routes */}
          <Route path="/en/calendar" element={<Calendar />} />
          <Route path="/ar/calendar" element={<Calendar />} />

          {/* Links routes */}
          <Route path="/en/links" element={<Links />} />
          <Route path="/ar/links" element={<Links />} />

          {/* About routes */}
          <Route path="/en/about" element={<About />} />
          <Route path="/ar/about" element={<About />} />

          {/* Privacy routes */}
          <Route path="/en/privacy" element={<Privacy />} />
          <Route path="/ar/privacy" element={<Privacy />} />

          {/* Guide routes */}
          <Route path="/en/guide" element={<Guide />} />
          <Route path="/ar/guide" element={<Guide />} />

          {/* Feedback routes */}
          <Route path="/en/feedback" element={<Feedback />} />
          <Route path="/ar/feedback" element={<Feedback />} />

          {/* Root and wildcard routes */}
          <Route path="/" element={<LocaleRedirect />} />
          <Route path="*" element={<LocaleRedirect />} />
        </Routes>
      </Sidebar>
    </LocalizedLayout>
  );
};

const App: React.FC = () => {
  // Set the font family on the body element
  useEffect(() => {
    document.body.style.fontFamily = '"IBM Plex Sans Arabic", sans-serif';
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <LocalizedApp />
      </Router>
    </LanguageProvider>
  );
};

export default App;
