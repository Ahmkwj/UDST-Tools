import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div
      className={`relative h-full w-full flex flex-col items-center justify-center ${
        isDark
          ? "bg-gradient-to-br from-black via-zinc-900 to-black text-white"
          : "bg-gradient-to-br from-white via-slate-50 to-white text-slate-900"
      } transition-colors duration-300`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
            isDark ? "bg-blue-900/10" : "bg-blue-50"
          } blur-3xl`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${
            isDark ? "bg-blue-900/10" : "bg-blue-50"
          } blur-3xl`}
        ></div>
      </div>

      {/* Dark mode toggle */}
      <div className="fixed md:absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2.5 rounded-full ${
            isDark
              ? "bg-zinc-800 hover:bg-zinc-700 ring-1 ring-zinc-700"
              : "bg-white hover:bg-slate-100 shadow-md ring-1 ring-slate-200"
          } transition-all`}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-400"
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
              className="w-5 h-5 text-blue-600"
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

      {/* Main content */}
      <div className="relative z-10 max-w-3xl w-full text-center px-4 md:px-6 py-8 md:py-12 space-y-6 md:space-y-8 mt-12 md:mt-0">
        <div className="space-y-4">
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight ${
              isDark
                ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent"
            }`}
          >
            UDST Tools
          </h1>
          <div className="h-1 w-16 md:w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <p
            className={`text-lg md:text-xl ${
              isDark ? "text-zinc-300" : "text-slate-700"
            }`}
          >
            A Student Project
          </p>
        </div>

        <div
          className={`p-6 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm ${
            isDark
              ? "bg-zinc-900/70 ring-1 ring-zinc-800/50"
              : "bg-white/70 shadow-xl ring-1 ring-slate-200/50"
          } transition-all max-w-xl mx-auto`}
        >
          <div
            className={`space-y-4 ${
              isDark ? "text-zinc-300" : "text-slate-600"
            }`}
          >
            <p className="leading-relaxed text-sm md:text-base">
              This website is a personal project created by a student to help
              organize and manage academic resources.
            </p>
            <p className="leading-relaxed font-medium text-sm md:text-base">
              Important Notice: This is an independent project and is not
              affiliated with, endorsed by, or connected to the University of
              Doha for Science and Technology (UDST) in any way.
            </p>
          </div>
        </div>

        <button className="mt-6 md:mt-8 px-5 md:px-6 py-3 md:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg md:rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-105 font-medium text-sm md:text-base">
          Explore Tools
        </button>
      </div>
    </div>
  );
}
