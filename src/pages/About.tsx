import Card from "../components/ui/Card";

export default function About() {
  return (
    <div className="relative min-h-screen w-full py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
        {/* Header section */}
        <div className="text-center mb-2 md:mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mt-4 mb-6">
            About UDST Tools
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
            A suite of tools designed to help UDST students manage their
            academic journey
          </p>
        </div>

        {/* Main content */}
        <Card title="Our Mission">
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 leading-relaxed">
              UDST Tools was created to simplify the academic management process
              for University of Doha for Science and Technology (UDST) students.
              From calculating GPA and projecting grades to managing attendance
              and planning schedules, these tools are designed to give UDST
              students better control and transparency over their academic
              progress.
            </p>

            <p className="text-zinc-300 leading-relaxed mt-4">
              The goal is simple: make academic planning less stressful and more
              accessible, allowing students to focus on what truly matters -
              learning and personal growth.
            </p>
          </div>
        </Card>

        {/* Development and disclaimer section */}
        <Card title="Development & Disclaimer">
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 leading-relaxed">
              UDST Tools was developed by a student developer with the intention
              of making academic life a little easier for UDST students. This
              platform is a personal project created to help fellow UDST
              students with common challenges faced throughout the university
              journey.
            </p>

            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 my-4">
              <p className="text-yellow-400 font-medium mb-2">
                Important Disclaimer:
              </p>
              <p className="text-zinc-300">
                This platform is{" "}
                <span className="font-semibold">
                  not affiliated with, endorsed by, or connected to
                </span>{" "}
                University of Doha for Science and Technology (UDST) in any
                official capacity. It is an independent student project created
                to help the student community.
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              The calculations and tools provided here are designed to be
              helpful but should not be considered official. Always verify
              important academic information with your university's official
              resources.
            </p>
          </div>
        </Card>

        {/* Features section */}
        <Card title="Tools & Features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
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
                      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  GPA Calculator
                </h3>
              </div>
              <p className="text-sm text-zinc-400">
                Calculate your current GPA based on course grades and credit
                hours. Track your academic performance across multiple
                semesters.
              </p>
            </div>

            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Grade Calculator
                </h3>
              </div>
              <p className="text-sm text-zinc-400">
                Estimate your final course grade based on assignment weightings
                and scores. Plan what you need to achieve on upcoming
                assignments.
              </p>
            </div>

            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Attendance Calculator
                </h3>
              </div>
              <p className="text-sm text-zinc-400">
                Track your attendance percentage and plan for future absences
                without exceeding course limits and risking attendance failure.
              </p>
            </div>

            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Schedule Maker
                </h3>
              </div>
              <p className="text-sm text-zinc-400">
                Create and organize your weekly class schedule with visual
                timetables that help you manage your time effectively.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer section */}
        <div className="text-center pt-4 pb-8">
          <p className="text-zinc-500 text-sm">
            Made with ❤️ by Ahmed for UDST students
          </p>
          <p className="text-zinc-600 text-xs mt-2">
            © {new Date().getFullYear()} UDST Tools • Version 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
