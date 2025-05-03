import { useState, useRef } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type ClassSession = {
  courseCode: string;
  courseName: string;
  section: string;
  type: string; // Lecture or Laboratory
  day: string;
  startTime: string;
  endTime: string;
  room: string;
};

type WeeklySchedule = {
  [key: string]: ClassSession[];
};

export default function ScheduleMaker() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedSchedule, setParsedSchedule] = useState<WeeklySchedule | null>(
    null
  );
  const [studentName, setStudentName] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = generateTimeSlots();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      parsePDF(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      parsePDF(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const parsePDF = async (file: File) => {
    setIsLoading(true);
    try {
      console.log("Starting PDF parsing...");

      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      console.log("File loaded as ArrayBuffer");

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`PDF loaded with ${pdf.numPages} pages`);

      let extractedText = "";

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .replace(/\s+/g, " ");
        console.log("Page text:", pageText);
        extractedText += pageText + "\n";
      }

      // Extract student name and semester
      // Try multiple patterns for name
      let nameMatch = extractedText.match(/Print\s+([^\s]+\s+[^\s]+)/);
      if (!nameMatch) {
        nameMatch = extractedText.match(/([^\s]+\s+[^\s]+)\s+Spring\s+\d{4}/);
      }

      // Try multiple patterns for semester
      let semesterMatch = extractedText.match(/([^\s]+\s+\d{4})\s+Credit/);
      if (!semesterMatch) {
        semesterMatch = extractedText.match(
          /([^\s]+\s+\d{4})\s+Class Schedule/i
        );
      }

      console.log("Name match:", nameMatch);
      console.log("Semester match:", semesterMatch);

      if (nameMatch) setStudentName(nameMatch[1].trim());
      if (semesterMatch) setSemester(semesterMatch[1].trim());

      // Initialize schedule object
      const schedule: WeeklySchedule = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
      };

      // Extract courses using multiple patterns
      const courseCodePrefixes =
        "(?:INFS|SOFT|COMP|MATH|MGMT|MKTG|ACCT|ECON|FINC|GENG|HRMT|BNKG|ISLM|ENGL|ARAB|GARC)";
      const courseRegex = new RegExp(
        `(${courseCodePrefixes}\\s+\\d{4})\\s+([^\\n]+?)(?=\\s+Status|\\s+Enrolled)`,
        "g"
      );
      const courses: { code: string; name: string }[] = [];

      let match;
      while ((match = courseRegex.exec(extractedText)) !== null) {
        courses.push({
          code: match[1].trim(),
          name: match[2].trim(),
        });
      }

      console.log("Extracted courses:", courses);

      // If no courses found with the regex, try an alternative approach
      if (courses.length === 0) {
        console.log("Trying alternative course extraction method...");

        // Look for course patterns directly
        const courseCodePattern = new RegExp(
          `^${courseCodePrefixes}\\s+\\d{4}`
        );
        const courseLines = extractedText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => courseCodePattern.test(line));

        console.log("Found course lines:", courseLines);

        courseLines.forEach((line) => {
          const parts = line.split(/\s+/);
          const code = `${parts[0]} ${parts[1]}`;
          const name = parts.slice(2).join(" ");

          courses.push({
            code: code,
            name: name,
          });
        });

        console.log("Extracted courses (alternative):", courses);
      }

      // Process each course
      courses.forEach((course) => {
        // Find the text block for this course
        const courseIndex = extractedText.indexOf(course.code);
        if (courseIndex === -1) {
          console.log(
            `Couldn't find position for course ${course.code} in text`
          );
          return;
        }

        const nextCourseIndex =
          courses
            .filter((c) => c !== course)
            .map((c) => extractedText.indexOf(c.code))
            .filter((index) => index > courseIndex)
            .sort((a, b) => a - b)[0] || extractedText.length;

        const courseBlock = extractedText.substring(
          courseIndex,
          nextCourseIndex
        );
        console.log(
          `Processing course block for ${course.code} (${course.name}):`,
          courseBlock
        );

        // Find all sections in this course block
        // First, split the course block into individual class sections
        const classBlocks: string[] = [];
        const classStartPositions: number[] = [];

        // Find all possible class section starts
        const sectionStartPatterns = [
          /Lecture\s+-\s+Class/g,
          /LEC\s+-\s+Class/g,
          /L TH\s+-\s+Class/g,
          /Laboratory\s+-\s+Class/g,
          /LAB\s+-\s+Class/g,
        ];

        // Support various section formats with different separators
        const sectionPatterns = [
          // Standard formats
          {
            type: "Lecture",
            pattern: /Lecture\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/,
          },
          {
            type: "Lecture",
            pattern: /LEC\s+-\s+Class\s+(\d+)\s+-Section\s+(\d+)/,
          },
          {
            type: "Lecture",
            pattern: /L TH\s+-\s+Class\s+(\d+)\s+-Section\s+(\d+)/,
          },

          // Standard formats - capturing the last group
          {
            type: "Lecture",
            pattern: /LEC\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/,
          },
          {
            type: "Lecture",
            pattern: /L TH\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/,
          },

          // Formats with different separators or missing parts
          {
            type: "Lecture",
            pattern: /Lecture\s+-\s+Class\s+\d+\s+Section\s+(\d+)/,
          },
          {
            type: "Lecture",
            pattern: /LEC\s+-\s+Class\s+\d+\s+Section\s+(\d+)/,
          },
          {
            type: "Lecture",
            pattern: /L TH\s+-\s+Class\s+\d+\s+Section\s+(\d+)/,
          },

          // Formats with just the section number
          { type: "Lecture", pattern: /Lecture.*?Section\s+(\d+)/ },
          { type: "Lecture", pattern: /LEC.*?Section\s+(\d+)/ },
          { type: "Lecture", pattern: /L TH.*?Section\s+(\d+)/ },
        ];

        const labSectionPatterns = [
          // Standard formats
          {
            type: "Laboratory",
            pattern: /Laboratory\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/,
          },
          {
            type: "Laboratory",
            pattern: /LAB\s+-\s+Class\s+(\d+)\s+-Section\s+(\d+)/,
          },

          // Standard formats - capturing the last group
          {
            type: "Laboratory",
            pattern: /LAB\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/,
          },

          // Formats with different separators or missing parts
          {
            type: "Laboratory",
            pattern: /Laboratory\s+-\s+Class\s+\d+\s+Section\s+(\d+)/,
          },
          {
            type: "Laboratory",
            pattern: /LAB\s+-\s+Class\s+\d+\s+Section\s+(\d+)/,
          },

          // Formats with just the section number
          { type: "Laboratory", pattern: /Laboratory.*?Section\s+(\d+)/ },
          { type: "Laboratory", pattern: /LAB.*?Section\s+(\d+)/ },
        ];

        // Support both time formats: "10:00AM to 12:00PM" and "09:30 to 11:00"
        const dayTimePatterns = [
          /Days:\s+(\w+)\s+Times:\s+(\d{1,2}:\d{2}(?:AM|PM)?)\s+to\s+(\d{1,2}:\d{2}(?:AM|PM)?)/g,
          /Days:\s+(\w+)\s+Times:\s+(\d{1,2}:\d{2})\s+to\s+(\d{1,2}:\d{2})/g,
        ];

        const roomPattern = /\d+\.\d+\.\d+/g;

        // Find all starting positions for class sections
        sectionStartPatterns.forEach((pattern) => {
          let match;
          while ((match = pattern.exec(courseBlock)) !== null) {
            classStartPositions.push(match.index);
          }
        });

        // Sort positions and create blocks for each section
        classStartPositions.sort((a, b) => a - b);

        if (classStartPositions.length === 0) {
          console.log("No class sections found for course:", course.code);
          return;
        }

        console.log("Found class section positions:", classStartPositions);

        // Create blocks for each section
        classStartPositions.forEach((startPos, index) => {
          const endPos =
            index < classStartPositions.length - 1
              ? classStartPositions[index + 1]
              : courseBlock.length;

          classBlocks.push(courseBlock.substring(startPos, endPos));
        });

        console.log("Class blocks:", classBlocks);

        // Process each class block
        classBlocks.forEach((classBlock, blockIndex) => {
          console.log(
            `Processing class block ${blockIndex + 1}:`,
            classBlock.substring(0, 100) + "..."
          );

          // Extract section information from this block
          let sectionType = "";
          let sectionNumber = "";

          // First check for simple section patterns directly matching the block
          const directSectionMatch = classBlock.match(
            /(?:L TH|LEC|LAB)\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/
          );
          if (directSectionMatch) {
            const typeMatch = classBlock.match(/^(L TH|LEC|LAB)/);
            sectionType = typeMatch
              ? typeMatch[1] === "LEC"
                ? "Lecture"
                : typeMatch[1] === "LAB"
                ? "Laboratory"
                : "Lecture"
              : "Lecture";
            sectionNumber = directSectionMatch[1];
            console.log(
              `Direct match found: ${sectionType} section ${sectionNumber}`
            );
          } else {
            // Try all section patterns
            for (const { type, pattern } of [
              ...sectionPatterns,
              ...labSectionPatterns,
            ]) {
              const match = classBlock.match(pattern);
              if (match) {
                sectionType = type;
                sectionNumber = match[match.length - 1];
                console.log(
                  `Pattern match found: ${sectionType} section ${sectionNumber}`
                );
                break;
              }
            }
          }

          if (!sectionNumber) {
            console.log("Could not find section number in block:", classBlock);
            return;
          }

          console.log(`Found section: ${sectionType} section ${sectionNumber}`);

          // Find day-times for this section
          const dayTimeMatches = [];

          // Try all day/time patterns
          for (const pattern of dayTimePatterns) {
            pattern.lastIndex = 0; // Reset regex state
            let dtMatch;
            while ((dtMatch = pattern.exec(classBlock)) !== null) {
              // Ensure times are in proper 12-hour format with AM/PM
              let startTime = dtMatch[2];
              let endTime = dtMatch[3];

              // If no AM/PM, add based on time (assuming 8-12 is AM, 13-23 is PM)
              if (!startTime.includes("AM") && !startTime.includes("PM")) {
                const hourPart = parseInt(startTime.split(":")[0]);
                startTime +=
                  hourPart >= 12 ? (hourPart > 12 ? "PM" : "PM") : "AM";
              }

              if (!endTime.includes("AM") && !endTime.includes("PM")) {
                const hourPart = parseInt(endTime.split(":")[0]);
                endTime +=
                  hourPart >= 12 ? (hourPart > 12 ? "PM" : "PM") : "AM";
              }

              dayTimeMatches.push({
                day: dtMatch[1],
                startTime,
                endTime,
              });
            }

            if (dayTimeMatches.length > 0) break;
          }

          // Find all rooms in this block
          // Reset the regex state for the room pattern
          roomPattern.lastIndex = 0;
          const rooms: string[] = [];
          let roomMatch;
          while ((roomMatch = roomPattern.exec(classBlock)) !== null) {
            rooms.push(roomMatch[0]);
          }

          console.log("Day-time matches for section:", dayTimeMatches);
          console.log("Room matches for section:", rooms);

          // Add sessions to schedule
          dayTimeMatches.forEach((timeInfo, index) => {
            if (weekdays.includes(timeInfo.day) && index < rooms.length) {
              schedule[timeInfo.day].push({
                courseCode: course.code,
                courseName: course.name,
                section: sectionNumber,
                type: sectionType,
                day: timeInfo.day,
                startTime: timeInfo.startTime,
                endTime: timeInfo.endTime,
                room: rooms[index],
              });
              console.log(
                `Added to schedule: ${course.code} (${sectionType}-${sectionNumber}) on ${timeInfo.day} at ${timeInfo.startTime}-${timeInfo.endTime} in room ${rooms[index]}`
              );
            }
          });
        });
      });

      console.log("Final schedule:", schedule);
      setParsedSchedule(schedule);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      alert(
        "Error parsing the PDF file. Please make sure it's in the correct format."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateICS = () => {
    if (!parsedSchedule) return;

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      "PRODID:-//UDST Tools//Schedule Maker//EN",
      `X-WR-CALNAME:${semester} Schedule`,
      "X-WR-TIMEZONE:Asia/Qatar",
    ];

    // Start date of the semester (example - would be dynamically calculated)
    const semesterStart = new Date("2025-01-12");

    // Iterate through each day and class
    for (const day in parsedSchedule) {
      parsedSchedule[day].forEach((classSession) => {
        // Calculate date for this class based on day of week
        const dayIndex = weekdays.indexOf(day);
        const dayOffset = (dayIndex - semesterStart.getDay() + 7) % 7;
        const classDate = new Date(semesterStart);
        classDate.setDate(semesterStart.getDate() + dayOffset);

        // Parse times
        const startParts = classSession.startTime.match(
          /(\d+):(\d+)\s*(AM|PM)/i
        );
        const endParts = classSession.endTime.match(/(\d+):(\d+)\s*(AM|PM)/i);

        if (!startParts || !endParts) return;

        let startHour = parseInt(startParts[1]);
        const startMinute = parseInt(startParts[2]);
        const startAmPm = startParts[3].toUpperCase();

        let endHour = parseInt(endParts[1]);
        const endMinute = parseInt(endParts[2]);
        const endAmPm = endParts[3].toUpperCase();

        // Convert to 24-hour format
        if (startAmPm === "PM" && startHour < 12) startHour += 12;
        if (startAmPm === "AM" && startHour === 12) startHour = 0;
        if (endAmPm === "PM" && endHour < 12) endHour += 12;
        if (endAmPm === "AM" && endHour === 12) endHour = 0;

        // Format dates for ICS
        const dtStart = formatDateForICS(classDate, startHour, startMinute);
        const dtEnd = formatDateForICS(classDate, endHour, endMinute);

        // Add 15 weeks of recurring events (approximate semester length)
        const eventUID = `${classSession.courseCode}-${
          classSession.section
        }-${day}-${Math.random().toString(36).substring(2, 11)}`;

        icsContent = [
          ...icsContent,
          "BEGIN:VEVENT",
          `UID:${eventUID}`,
          `SUMMARY:${classSession.courseCode}-${classSession.section} ${classSession.type}`,
          `LOCATION:Room ${classSession.room}`,
          `DESCRIPTION:${classSession.courseCode}-${classSession.section} ${classSession.type}\\nRoom: ${classSession.room}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          "RRULE:FREQ=WEEKLY;COUNT=15",
          "END:VEVENT",
        ];
      });
    }

    icsContent.push("END:VCALENDAR");

    // Create and download the ICS file
    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${semester.replace(/\s+/g, "_")}_Schedule.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function formatDateForICS(
    date: Date,
    hours: number,
    minutes: number
  ): string {
    return `${date.getFullYear()}${padZero(date.getMonth() + 1)}${padZero(
      date.getDate()
    )}T${padZero(hours)}${padZero(minutes)}00Z`;
  }

  function padZero(num: number): string {
    return num.toString().padStart(2, "0");
  }

  function generateTimeSlots(): string[] {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const amPm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour > 12 ? hour - 12 : hour;
      slots.push(`${hour12}:00 ${amPm}`);
      slots.push(`${hour12}:30 ${amPm}`);
    }
    return slots;
  }

  function convertTimeToMinutes(timeString: string): number {
    const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  function getClassColor(courseCode: string): string {
    // Generate a consistent color based on course code
    let hash = 0;
    for (let i = 0; i < courseCode.length; i++) {
      hash = courseCode.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Enhanced color palette with more vibrant but professional colors
    const colorPalette = [
      "bg-gradient-to-br from-blue-500/90 to-blue-600/90",
      "bg-gradient-to-br from-indigo-500/90 to-indigo-600/90",
      "bg-gradient-to-br from-violet-500/90 to-violet-600/90",
      "bg-gradient-to-br from-purple-500/90 to-purple-600/90",
      "bg-gradient-to-br from-fuchsia-500/90 to-fuchsia-600/90",
      "bg-gradient-to-br from-pink-500/90 to-pink-600/90",
      "bg-gradient-to-br from-rose-500/90 to-rose-600/90",
      "bg-gradient-to-br from-orange-500/90 to-orange-600/90",
      "bg-gradient-to-br from-amber-500/90 to-amber-600/90",
      "bg-gradient-to-br from-emerald-500/90 to-emerald-600/90",
      "bg-gradient-to-br from-teal-500/90 to-teal-600/90",
      "bg-gradient-to-br from-cyan-500/90 to-cyan-600/90",
    ];

    return colorPalette[Math.abs(hash) % colorPalette.length];
  }

  return (
    <div className="relative min-h-screen w-full py-6 md:py-8 px-2 md:px-8 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Upload Section */}
          <Card title="Class Schedule Maker">
            <div className="text-center mb-6">
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Upload your PeopleSoft schedule PDF to create a calendar file
                (.ics) that you can import into Google Calendar, Apple Calendar,
                or any other calendar app.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg ${
                parsedSchedule
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700 bg-zinc-800/30"
              } p-6 md:p-10 text-center transition-colors duration-300 cursor-pointer`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />

              {isLoading ? (
                <div className="py-6">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-zinc-300">Parsing schedule...</p>
                </div>
              ) : parsedSchedule ? (
                <div className="py-4">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-blue-400 text-lg font-medium mb-2">
                    {parsedSchedule.Sunday[0].courseName}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Click or drag to upload a different file
                  </p>
                </div>
              ) : (
                <div className="py-6">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-zinc-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    <p className="text-zinc-300 text-lg font-medium mb-2">
                      Drag & drop your schedule PDF file here
                    </p>
                    <p className="text-zinc-500 text-sm mb-4">
                      or click to browse your files
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="pointer-events-none"
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Schedule Display */}
          {parsedSchedule && (
            <Card title="Your Class Schedule">
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {studentName}
                  </h3>
                  <p className="text-zinc-400">{semester}</p>
                </div>

                <Button onClick={generateICS} className="whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Download Calendar (.ics)
                </Button>
              </div>

              {/* Weekly Schedule Display */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px] mt-6 relative">
                  {/* Grid Header */}
                  <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                    {/* Time column header */}
                    <div className="p-2 text-center text-zinc-500 text-xs font-medium">
                      Time
                    </div>

                    {/* Day columns headers */}
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-zinc-300 font-medium"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Time Grid */}
                  <div className="grid grid-cols-[80px_repeat(5,1fr)] relative">
                    {/* Time slots column */}
                    <div className="col-span-1">
                      {timeSlots.map((timeSlot, timeIndex) => (
                        <div
                          key={`time-${timeSlot}`}
                          className={`h-14 p-2 flex items-center justify-center text-zinc-500 text-[10px] font-medium
                            ${
                              timeIndex % 2 === 0
                                ? "bg-zinc-900/50"
                                : "bg-zinc-900/30"
                            }
                            border-b border-zinc-800/50
                          `}
                        >
                          {timeSlot}
                        </div>
                      ))}
                    </div>

                    {/* Day columns with classes */}
                    {weekdays.map((day) => (
                      <div key={`day-${day}`} className="col-span-1 relative">
                        {/* Time slot backgrounds */}
                        {timeSlots.map((timeSlot, timeIndex) => (
                          <div
                            key={`bg-${day}-${timeSlot}`}
                            className={`h-14 border-b border-zinc-800/50
                              ${
                                timeIndex % 2 === 0
                                  ? "bg-zinc-900/50"
                                  : "bg-zinc-900/30"
                              }
                            `}
                          />
                        ))}

                        {/* Classes */}
                        {parsedSchedule[day]
                          ?.filter((cls) => cls.day === day)
                          .map((classSession, classIndex) => {
                            const startMinutes = convertTimeToMinutes(
                              classSession.startTime
                            );
                            const endMinutes = convertTimeToMinutes(
                              classSession.endTime
                            );
                            const dayStartMinutes =
                              convertTimeToMinutes("8:00 AM");
                            const colorClass = getClassColor(
                              classSession.courseCode
                            );

                            // Calculate position and height
                            const topPosition =
                              ((startMinutes - dayStartMinutes) / 30) * 56;
                            const height =
                              ((endMinutes - startMinutes) / 30) * 56;

                            // Determine if this is a long class (more than 2 hours)
                            const durationInHours =
                              (endMinutes - startMinutes) / 60;
                            const isLongClass = durationInHours >= 2;

                            return (
                              <div
                                key={`class-${day}-${classIndex}`}
                                className={`absolute left-1 right-1 ${colorClass} overflow-hidden shadow-lg backdrop-blur-sm border border-white/10`}
                                style={{
                                  top: `${topPosition}px`,
                                  height: `${height}px`,
                                  zIndex: 5,
                                }}
                              >
                                <div className="h-full p-2.5 text-white flex flex-col">
                                  <div
                                    className={`font-semibold tracking-wide ${
                                      isLongClass ? "text-base mb-2" : ""
                                    }`}
                                  >
                                    {classSession.courseCode}-
                                    {classSession.section}
                                  </div>
                                  <div
                                    className={`font-medium opacity-90 whitespace-normal ${
                                      isLongClass
                                        ? "text-sm mb-3 line-clamp-2"
                                        : "text-[11px] line-clamp-1 mt-0.5"
                                    }`}
                                  >
                                    {classSession.courseName}
                                  </div>
                                  <div
                                    className={`flex items-center gap-1 ${
                                      isLongClass
                                        ? "text-sm mb-3"
                                        : "text-[11px] mt-1.5"
                                    }`}
                                  >
                                    <span
                                      className={`px-1.5 py-0.5 rounded bg-black/20 font-medium ${
                                        isLongClass ? "text-sm px-2" : ""
                                      }`}
                                    >
                                      {classSession.type}
                                    </span>
                                  </div>
                                  <div
                                    className={`text-[11px] font-medium text-white/90 flex flex-col ${
                                      isLongClass
                                        ? "gap-2 mt-auto text-sm"
                                        : "gap-0.5 mt-2"
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`${
                                          isLongClass ? "h-4 w-4" : "h-3 w-3"
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      {classSession.startTime} -{" "}
                                      {classSession.endTime}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`${
                                          isLongClass ? "h-4 w-4" : "h-3 w-3"
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                      Room {classSession.room}
                                    </div>
                                    {isLongClass && (
                                      <div className="mt-2 pt-2 border-t border-white/10 text-xs">
                                        <div className="font-medium text-white/75">
                                          Duration: {durationInHours} hours
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course List */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h3 className="text-lg font-medium text-white mb-4">
                  Course List
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Create a unique list of courses */}
                  {Object.values(parsedSchedule)
                    .flat()
                    .filter(
                      (class1, index, self) =>
                        index ===
                        self.findIndex(
                          (class2) =>
                            class1.courseCode === class2.courseCode &&
                            class1.section === class2.section
                        )
                    )
                    .map((uniqueClass) => {
                      const colorClass = getClassColor(uniqueClass.courseCode);

                      return (
                        <div
                          key={`${uniqueClass.courseCode}-${uniqueClass.section}`}
                          className="flex items-center p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800/70 transition-colors"
                        >
                          <div
                            className={`w-1.5 h-12 mr-4 rounded-full ${colorClass
                              .replace("bg-gradient-to-br from-", "bg-")
                              .replace("/90 to-[^/]+/90", "")}`}
                          ></div>
                          <div>
                            <div className="font-medium text-white">
                              {uniqueClass.courseCode}-{uniqueClass.section}
                            </div>
                            <div className="text-sm text-white/90 mb-1 line-clamp-1">
                              {uniqueClass.courseName}
                            </div>
                            <div className="inline-block px-2 py-1 rounded bg-zinc-900/50 text-xs font-medium text-zinc-400">
                              {uniqueClass.type}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
