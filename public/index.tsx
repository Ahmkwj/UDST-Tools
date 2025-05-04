import * as React from "react";

const Home: React.FC = () => {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-3xl w-full text-center px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            UDST Tools
          </h1>
          <div className="h-1 w-16 md:w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <p className="text-lg md:text-xl text-zinc-300">
            Academic Tools for Students
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          <a
            href="/gpa-calculator"
            className="p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 transition-all group"
          >
            <h2 className="font-medium text-white mb-1">GPA Calculator</h2>
            <p className="text-sm text-zinc-400">
              Track your academic progress
            </p>
          </a>
          <a
            href="/grade-calculator"
            className="p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 transition-all group"
          >
            <h2 className="font-medium text-white mb-1">Grade Calculator</h2>
            <p className="text-sm text-zinc-400">Plan your course grades</p>
          </a>
          <a
            href="/attendance-calculator"
            className="p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 transition-all group"
          >
            <h2 className="font-medium text-white mb-1">Attendance</h2>
            <p className="text-sm text-zinc-400">Monitor class attendance</p>
          </a>
          <a
            href="/schedule-maker"
            className="p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 transition-all group"
          >
            <h2 className="font-medium text-white mb-1">Schedule</h2>
            <p className="text-sm text-zinc-400">Create your timetable</p>
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          An independent student project, not affiliated with UDST
        </p>
      </div>
    </div>
  );
};

export default Home;
