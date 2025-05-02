import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 ${
        isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
      } transition-colors duration-300`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-lg ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700"
              : "bg-white hover:bg-slate-200"
          } transition-colors`}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to UDST Tools
        </h1>
        <div
          className={`h-1 w-24 mx-auto ${
            isDark ? "bg-indigo-500" : "bg-indigo-600"
          }`}
        ></div>
        <p className="text-xl">
          Your one-stop dashboard for managing and analyzing data.
        </p>

        <div
          className={`p-8 rounded-xl ${
            isDark ? "bg-slate-800" : "bg-white shadow-lg"
          } transition-colors max-w-xl mx-auto`}
        >
          <p className="leading-relaxed">
            This modern interface provides a seamless experience for all your
            data processing needs. Navigate through the sidebar to access
            different tools and features.
          </p>
        </div>

        <button className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}
