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
import SchedulePlanner from "./pages/SchedulePlanner";
import Feedback from "./pages/Feedback";
import Links from "./pages/Links";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AcademicInfo from "./pages/AcademicInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import {
  LanguageProvider,
  useLocale,
  useSetLocale,
} from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "../public";
import StudyTimeCalculator from "./pages/StudyTimeCalculator";
import CourseRequest from "./pages/CourseRequest";
import ViewCourseRequest from "./pages/ViewCourseRequest";
import SwapWithMe from "./pages/SwapWithMe";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const locale = useLocale();

  // Update currentPath when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (
      user &&
      (location.pathname.includes("/login") ||
        location.pathname.includes("/signup"))
    ) {
      navigate(`/${locale}`);
    }
  }, [user, location.pathname, navigate, locale]);

  // Check if the current page is Login or SignUp to hide sidebar
  const isAuthPage =
    location.pathname.includes("/login") ||
    location.pathname.includes("/signup");

  return (
    <LocalizedLayout>
      {isAuthPage ? (
        <Routes>
          {/* Auth routes */}
          <Route path="/en/login" element={<Login />} />
          <Route path="/ar/login" element={<Login />} />
          <Route path="/en/signup" element={<SignUp />} />
          <Route path="/ar/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Sidebar currentPath={currentPath} onNavigate={setCurrentPath}>
          <Routes>
            {/* Home routes - Public */}
            <Route path="/en" element={<Home />} />
            <Route path="/ar" element={<Home />} />

            {/* Public routes */}
            <Route path="/en/calendar" element={<Calendar />} />
            <Route path="/ar/calendar" element={<Calendar />} />
            <Route path="/en/links" element={<Links />} />
            <Route path="/ar/links" element={<Links />} />
            <Route path="/en/about" element={<About />} />
            <Route path="/ar/about" element={<About />} />
            <Route path="/en/guide" element={<Guide />} />
            <Route path="/ar/guide" element={<Guide />} />
            <Route path="/en/privacy" element={<Privacy />} />
            <Route path="/ar/privacy" element={<Privacy />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/en/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/gpa-calculator"
              element={
                <ProtectedRoute>
                  <GPACalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/gpa-calculator"
              element={
                <ProtectedRoute>
                  <GPACalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/grade-calculator"
              element={
                <ProtectedRoute>
                  <GradeCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/grade-calculator"
              element={
                <ProtectedRoute>
                  <GradeCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/attendance-calculator"
              element={
                <ProtectedRoute>
                  <AttendanceCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/attendance-calculator"
              element={
                <ProtectedRoute>
                  <AttendanceCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/schedule-planner"
              element={
                <ProtectedRoute>
                  <SchedulePlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/schedule-planner"
              element={
                <ProtectedRoute>
                  <SchedulePlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/study-time-calculator"
              element={
                <ProtectedRoute>
                  <StudyTimeCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/study-time-calculator"
              element={
                <ProtectedRoute>
                  <StudyTimeCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/academic-info"
              element={
                <ProtectedRoute>
                  <AcademicInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/academic-info"
              element={
                <ProtectedRoute>
                  <AcademicInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/course-request"
              element={
                <ProtectedRoute>
                  <CourseRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/course-request"
              element={
                <ProtectedRoute>
                  <CourseRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/en/view-request/:slug"
              element={<ViewCourseRequest />}
            />
            <Route
              path="/ar/view-request/:slug"
              element={<ViewCourseRequest />}
            />
            <Route
              path="/en/swap-with-me"
              element={
                <ProtectedRoute>
                  <SwapWithMe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ar/swap-with-me"
              element={
                <ProtectedRoute>
                  <SwapWithMe />
                </ProtectedRoute>
              }
            />

            {/* Root and wildcard routes */}
            <Route path="/" element={<LocaleRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Sidebar>
      )}
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
      <AuthProvider>
        <Router>
          <LocalizedApp />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
