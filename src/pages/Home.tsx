export default function Home() {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-3xl w-full text-center px-4 md:px-6 py-8 md:py-12 space-y-6 md:space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            UDST Tools
          </h1>
          <div className="h-1 w-16 md:w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <p className="text-lg md:text-xl text-zinc-300">A Student Project</p>
        </div>

        <div className="p-6 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 transition-all max-w-xl mx-auto">
          <div className="space-y-4 text-zinc-300">
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
