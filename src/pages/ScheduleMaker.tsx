import { useState, useRef, useEffect } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import * as pdfjsLib from "pdfjs-dist";
import Footer from "../components/ui/Footer";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ===== Type Definitions =====
type ClassSession = {
  courseCode: string;
  courseName: string;
  section: string;
  type: string; // "Lecture", "Laboratory", etc.
  day: string;
  startTime: string;
  endTime: string;
  room: string;
};

type WeeklySchedule = {
  [key: string]: ClassSession[];
};

export default function ScheduleMaker() {
  // ===== Schedule State =====
  const [parsedSchedule, setParsedSchedule] = useState<WeeklySchedule | null>(
    null
  );
  const [editedSchedule, setEditedSchedule] = useState<WeeklySchedule | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== Student Information =====
  const [studentName, setStudentName] = useState<string>("");
  const [semester, setSemester] = useState<string>("");

  // ===== UI References =====
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== Calendar Export Options =====
  const [semesterStartDate, setSemesterStartDate] = useState<string>("");
  const [semesterEndDate, setSemesterEndDate] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("1 hour");
  const [displayPreference, setDisplayPreference] = useState<string>("code");
  const eventWeeks = "15"; // Number of weeks to generate recurring events for

  // ===== Schedule Display Settings =====
  const [lastTimeSlot, setLastTimeSlot] = useState<number>(17 * 60); // Default to 5:00 PM

  // ===== Constants =====
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeOptions = generateTimeOptions();

  // ===== Effect Hooks =====

  // Calculate default semester dates when semester info is available
  useEffect(() => {
    if (semester) {
      const year = new Date().getFullYear();

      if (
        semester.toLowerCase().includes("fall") ||
        semester.toLowerCase().includes("winter")
      ) {
        // Fall/Winter usually starts in September and ends in December
        setSemesterStartDate(`${year}-09-01`);
        setSemesterEndDate(`${year}-12-20`);
      } else if (
        semester.toLowerCase().includes("spring") ||
        semester.toLowerCase().includes("summer")
      ) {
        // Spring/Summer usually starts in May and ends in August
        setSemesterStartDate(`${year}-05-01`);
        setSemesterEndDate(`${year}-08-20`);
      } else {
        // Default to current month for start and 4 months later for end
        const today = new Date();
        setSemesterStartDate(
          `${year}-${String(today.getMonth() + 1).padStart(2, "0")}-01`
        );

        const endDate = new Date(today);
        endDate.setMonth(today.getMonth() + 4);
        setSemesterEndDate(
          `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
            2,
            "0"
          )}-01`
        );
      }
    }
  }, [semester]);

  // Update last time slot whenever schedule changes
  useEffect(() => {
    if (parsedSchedule) {
      const newLastTimeSlot = calculateLastTimeSlot(parsedSchedule);
      setLastTimeSlot(newLastTimeSlot);
    }
  }, [parsedSchedule]);

  // Update last time slot when editing schedule
  useEffect(() => {
    if (isEditing && editedSchedule) {
      const newLastTimeSlot = calculateLastTimeSlot(editedSchedule);
      setLastTimeSlot(newLastTimeSlot);
    }
  }, [isEditing, editedSchedule]);

  // ===== Utility Functions =====

  // Generate list of time options for dropdowns
  function generateTimeOptions(): string[] {
    const timeOptions = [];
    for (let hour = 8; hour <= 23; hour++) {
      const amPm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const formattedHour = hour12.toString().padStart(2, "0");
      timeOptions.push(`${formattedHour}:00 ${amPm}`);
      timeOptions.push(`${formattedHour}:30 ${amPm}`);
    }
    return timeOptions;
  }

  // Generate time slots for schedule display
  function generateTimeSlots(): string[] {
    const slots = [];
    // Get the last hour (rounding up to the nearest 30 min)
    const lastHour = Math.ceil(lastTimeSlot / 60);

    for (let hour = 8; hour <= lastHour; hour++) {
      const amPm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      slots.push(`${hour12}:00 ${amPm}`);
      // Add the 30-minute slot only if we haven't exceeded the last time
      if (hour < lastHour || (hour === lastHour && lastTimeSlot % 60 >= 30)) {
        slots.push(`${hour12}:30 ${amPm}`);
      }
    }
    return slots;
  }

  // Convert time string to minutes for comparison
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

  // Normalize time format for consistency
  function normalizeTimeFormat(timeString: string): string {
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return timeString;

    const hour = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();

    const formattedHour = hour.toString().padStart(2, "0");
    return `${formattedHour}:${minutes} ${ampm}`;
  }

  // Format date for ICS calendar file
  function formatDateForICS(
    date: Date,
    hours: number,
    minutes: number
  ): string {
    return `${date.getFullYear()}${padZero(date.getMonth() + 1)}${padZero(
      date.getDate()
    )}T${padZero(hours)}${padZero(minutes)}00`;
  }

  // Helper function to pad numbers with leading zero
  function padZero(num: number): string {
    return num.toString().padStart(2, "0");
  }

  // Get consistent color for a course based on course code
  function getClassColor(courseCode: string): string {
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

  // Determine the last time slot needed for the schedule
  function calculateLastTimeSlot(schedule: WeeklySchedule): number {
    let latestEndTime = 17 * 60; // Default to 5:00 PM (17 hours * 60 minutes)

    // Check all days and classes to find the latest end time
    Object.values(schedule).forEach((classSessions) => {
      classSessions.forEach((session) => {
        const endTimeMinutes = convertTimeToMinutes(session.endTime);
        // Round up to the next hour for better display
        const roundedUpTime = Math.ceil(endTimeMinutes / 60) * 60;
        latestEndTime = Math.max(latestEndTime, roundedUpTime + 60); // Add an hour buffer
      });
    });

    // Cap at 23:30 (the last available slot)
    return Math.min(latestEndTime, 23.5 * 60);
  }

  // Check if time range is valid (end time after start time)
  function isValidTimeRange(startTime: string, endTime: string): boolean {
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);
    return endMinutes > startMinutes;
  }

  // ===== File Handling =====

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      parsePDF(e.target.files[0]);
    }
  };

  // Handle drag-over event for file drop zone
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      parsePDF(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ===== Schedule Editing Functions =====

  // Begin editing the schedule
  const startEditing = () => {
    if (parsedSchedule) {
      // Deep clone the schedule
      const scheduleClone = JSON.parse(JSON.stringify(parsedSchedule));

      // Normalize time formats in the cloned schedule
      for (const day in scheduleClone) {
        scheduleClone[day] = scheduleClone[day].map(
          (classSession: ClassSession) => ({
            ...classSession,
            startTime: normalizeTimeFormat(classSession.startTime),
            endTime: normalizeTimeFormat(classSession.endTime),
          })
        );
      }

      setEditedSchedule(scheduleClone);
    } else {
      setEditedSchedule(null);
    }
    setIsEditing(true);
  };

  // Save edited schedule
  const saveChanges = () => {
    if (editedSchedule) {
      // Update the last time slot based on the edited schedule
      const newLastTimeSlot = calculateLastTimeSlot(editedSchedule);
      setLastTimeSlot(newLastTimeSlot);
      setParsedSchedule(editedSchedule);
    }
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedSchedule(null);
  };

  // Update class session details during editing
  const handleClassEdit = (
    day: string,
    index: number,
    field: keyof ClassSession,
    value: string
  ) => {
    if (!editedSchedule) return;

    const updatedSchedule = { ...editedSchedule };
    updatedSchedule[day] = [...updatedSchedule[day]];

    // When changing start time, ensure end time is later
    if (field === "startTime") {
      const currentEndTime = updatedSchedule[day][index].endTime;
      const startTimeMinutes = convertTimeToMinutes(value);
      const endTimeMinutes = convertTimeToMinutes(currentEndTime);

      // If end time is not later than new start time, adjust end time
      if (endTimeMinutes <= startTimeMinutes) {
        // Find the next available time slot after start time
        const startTimeIndex = timeOptions.findIndex((time) => time === value);
        if (startTimeIndex < timeOptions.length - 1) {
          updatedSchedule[day][index] = {
            ...updatedSchedule[day][index],
            [field]: value,
            endTime: timeOptions[startTimeIndex + 1],
          };
          setEditedSchedule(updatedSchedule);
          return;
        }
      }
    }

    // When changing end time, ensure it's after start time
    if (field === "endTime") {
      const currentStartTime = updatedSchedule[day][index].startTime;
      const startTimeMinutes = convertTimeToMinutes(currentStartTime);
      const endTimeMinutes = convertTimeToMinutes(value);

      // Don't allow end time to be before or equal to start time
      if (endTimeMinutes <= startTimeMinutes) {
        return; // Reject the change
      }
    }

    // Apply the change for other fields or valid time changes
    updatedSchedule[day][index] = {
      ...updatedSchedule[day][index],
      [field]: value,
    };

    setEditedSchedule(updatedSchedule);
  };

  // ===== PDF Processing =====

  // Main PDF parsing function
  const parsePDF = async (file: File) => {
    setIsLoading(true);
    try {
      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Extract text from all pages
      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .replace(/\s+/g, " ");
        extractedText += pageText + "\n";
      }

      // Extract student information
      extractStudentInfo(extractedText);

      // Parse courses and schedule
      const schedule = parseSchedule(extractedText);

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

  // Extract student name and semester from PDF text
  const extractStudentInfo = (text: string) => {
    // Try multiple patterns for name
    let nameMatch = text.match(/Print\s+([^\s]+\s+[^\s]+)/);
    if (!nameMatch) {
      nameMatch = text.match(/([^\s]+\s+[^\s]+)\s+Spring\s+\d{4}/);
    }

    // Try multiple patterns for semester
    let semesterMatch = text.match(/([^\s]+\s+\d{4})\s+Credit/);
    if (!semesterMatch) {
      semesterMatch = text.match(/([^\s]+\s+\d{4})\s+Class Schedule/i);
    }

    if (nameMatch) setStudentName(nameMatch[1].trim());
    if (semesterMatch) setSemester(semesterMatch[1].trim());
  };

  // Parse courses and schedule from PDF text
  const parseSchedule = (text: string): WeeklySchedule => {
    // Initialize schedule object
    const schedule: WeeklySchedule = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
    };

    // Extract courses
    const courses = extractCourses(text);

    // Process each course to extract class sessions
    courses.forEach((course) => {
      const courseIndex = text.indexOf(course.code);
      if (courseIndex === -1) return;

      const nextCourseIndex = findNextCourseIndex(
        text,
        courseIndex,
        courses,
        course
      );
      const courseBlock = text.substring(courseIndex, nextCourseIndex);

      // Process class sections for this course
      processCourseSections(courseBlock, course, schedule);
    });

    return schedule;
  };

  // Extract courses from the PDF text
  const extractCourses = (text: string): { code: string; name: string }[] => {
    const courseCodePrefixes =
      "(?:INFS|SOFT|COMP|MATH|MGMT|MKTG|ACCT|ECON|FINC|GENG|HRMT|BNKG|ISLM|ENGL|ARAB|GARC)";
    const courseRegex = new RegExp(
      `(${courseCodePrefixes}\\s+\\d{4})\\s+([^\\n]+?)(?=\\s+Status|\\s+Enrolled)`,
      "g"
    );

    const courses: { code: string; name: string }[] = [];
    let match;

    while ((match = courseRegex.exec(text)) !== null) {
      courses.push({
        code: match[1].trim(),
        name: match[2].trim(),
      });
    }

    // If no courses found with the regex, try an alternative approach
    if (courses.length === 0) {
      // Look for course patterns directly
      const courseCodePattern = new RegExp(`^${courseCodePrefixes}\\s+\\d{4}`);
      const courseLines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => courseCodePattern.test(line));

      courseLines.forEach((line) => {
        const parts = line.split(/\s+/);
        const code = `${parts[0]} ${parts[1]}`;
        const name = parts.slice(2).join(" ");

        courses.push({ code, name });
      });
    }

    return courses;
  };

  // Find the index of the next course block in the text
  const findNextCourseIndex = (
    text: string,
    currentIndex: number,
    courses: { code: string; name: string }[],
    currentCourse: { code: string; name: string }
  ): number => {
    return (
      courses
        .filter((c) => c !== currentCourse)
        .map((c) => text.indexOf(c.code))
        .filter((index) => index > currentIndex)
        .sort((a, b) => a - b)[0] || text.length
    );
  };

  // Process course sections to extract class sessions
  const processCourseSections = (
    courseBlock: string,
    course: { code: string; name: string },
    schedule: WeeklySchedule
  ) => {
    // Find all sections in this course block
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
      { type: "Lecture", pattern: /LEC\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/ },
      { type: "Lecture", pattern: /L TH\s+-\s+Class\s+\d+\s+-Section\s+(\d+)/ },
      // Formats with different separators or missing parts
      {
        type: "Lecture",
        pattern: /Lecture\s+-\s+Class\s+\d+\s+Section\s+(\d+)/,
      },
      { type: "Lecture", pattern: /LEC\s+-\s+Class\s+\d+\s+Section\s+(\d+)/ },
      { type: "Lecture", pattern: /L TH\s+-\s+Class\s+\d+\s+Section\s+(\d+)/ },
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

    if (classStartPositions.length === 0) return;

    // Create blocks for each section
    classStartPositions.forEach((startPos, index) => {
      const endPos =
        index < classStartPositions.length - 1
          ? classStartPositions[index + 1]
          : courseBlock.length;

      classBlocks.push(courseBlock.substring(startPos, endPos));
    });

    // Process each class block
    classBlocks.forEach((classBlock) => {
      // Extract section information
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
            break;
          }
        }
      }

      if (!sectionNumber) return;

      // Find day-times for this section
      const dayTimeMatches: {
        day: string;
        startTime: string;
        endTime: string;
      }[] = [];

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
            startTime += hourPart >= 12 ? (hourPart > 12 ? "PM" : "PM") : "AM";
          }

          if (!endTime.includes("AM") && !endTime.includes("PM")) {
            const hourPart = parseInt(endTime.split(":")[0]);
            endTime += hourPart >= 12 ? (hourPart > 12 ? "PM" : "PM") : "AM";
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
      roomPattern.lastIndex = 0;
      const rooms: string[] = [];
      let roomMatch;
      while ((roomMatch = roomPattern.exec(classBlock)) !== null) {
        rooms.push(roomMatch[0]);
      }

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
        }
      });
    });
  };

  // ===== Calendar Export =====

  // Generate and download ICS calendar file
  const generateICS = () => {
    if (!parsedSchedule) return;

    // Get the schedule to use (either edited or original)
    const scheduleToExport = isEditing ? editedSchedule : parsedSchedule;
    if (!scheduleToExport) return;

    // Create calendar header
    let icsContent = createCalendarHeader();

    // Parse semester start date from input
    const semesterStart = semesterStartDate
      ? new Date(semesterStartDate)
      : new Date();

    // Calculate end of recurrence based on weeks or end date
    const recurrenceEnd = calculateRecurrenceEnd();

    // Format recurrence end date for RRULE
    const recurrenceEndStr = `${recurrenceEnd.getFullYear()}${padZero(
      recurrenceEnd.getMonth() + 1
    )}${padZero(recurrenceEnd.getDate())}T235959`;

    // Parse reminder time
    const reminderMinutes = getReminderMinutes();

    // Create calendar events for each class
    icsContent = addClassEvents(
      icsContent,
      scheduleToExport,
      semesterStart,
      recurrenceEndStr,
      reminderMinutes
    );

    // Close calendar file
    icsContent.push("END:VCALENDAR");

    // Download the file
    downloadIcsFile(icsContent);
  };

  // Create ICS calendar header
  const createCalendarHeader = (): string[] => {
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      "PRODID:-//UDST Tools//Schedule Maker//EN",
      `X-WR-CALNAME:${semester} Schedule`,
      "X-WR-TIMEZONE:Asia/Qatar",
    ];
  };

  // Calculate recurrence end date
  const calculateRecurrenceEnd = (): Date => {
    const recurrenceEnd = new Date(semesterEndDate || semesterStartDate);
    if (!semesterEndDate) {
      // If no end date provided, calculate based on weeks
      recurrenceEnd.setDate(recurrenceEnd.getDate() + parseInt(eventWeeks) * 7);
    }
    return recurrenceEnd;
  };

  // Get reminder minutes from selected reminder option
  const getReminderMinutes = (): number => {
    let minutes = 60; // Default 1 hour
    if (reminderTime === "30 minutes") minutes = 30;
    if (reminderTime === "2 hours") minutes = 120;
    if (reminderTime === "1 day") minutes = 1440;
    return minutes;
  };

  // Add class events to calendar content
  const addClassEvents = (
    icsContent: string[],
    schedule: WeeklySchedule,
    semesterStart: Date,
    recurrenceEndStr: string,
    reminderMinutes: number
  ): string[] => {
    // Iterate through each day and class
    for (const day in schedule) {
      schedule[day].forEach((classSession) => {
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

        if (!startParts || !endParts) return icsContent;

        // Convert to 24-hour format
        const { startHour, startMinute, endHour, endMinute } =
          convertTimesToComponents(startParts, endParts);

        // Format dates for ICS
        const dtStart = formatDateForICS(classDate, startHour, startMinute);
        const dtEnd = formatDateForICS(classDate, endHour, endMinute);

        // Create event
        icsContent = addEvent(
          icsContent,
          classSession,
          dtStart,
          dtEnd,
          recurrenceEndStr,
          reminderMinutes
        );
      });
    }

    return icsContent;
  };

  // Convert time matches to hour/minute components
  const convertTimesToComponents = (
    startParts: RegExpMatchArray,
    endParts: RegExpMatchArray
  ) => {
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

    return { startHour, startMinute, endHour, endMinute };
  };

  // Add a calendar event
  const addEvent = (
    icsContent: string[],
    classSession: ClassSession,
    dtStart: string,
    dtEnd: string,
    recurrenceEndStr: string,
    reminderMinutes: number
  ): string[] => {
    // Create a unique identifier for this event
    const eventUID = `${classSession.courseCode}-${classSession.section}-${
      classSession.day
    }-${Math.random().toString(36).substring(2, 11)}`;

    // Determine event summary based on user preference
    const eventSummary =
      displayPreference === "code"
        ? `${classSession.courseCode}-${classSession.section} ${classSession.type}`
        : `${classSession.courseName} ${classSession.type}`;

    // Add event to calendar
    return [
      ...icsContent,
      "BEGIN:VEVENT",
      `UID:${eventUID}`,
      `SUMMARY:${eventSummary}`,
      `LOCATION:Room ${classSession.room}`,
      `DESCRIPTION:${classSession.courseCode}-${classSession.section} ${classSession.type}\\nCourse: ${classSession.courseName}\\nRoom: ${classSession.room}`,
      `DTSTART;TZID=Asia/Qatar:${dtStart}`,
      `DTEND;TZID=Asia/Qatar:${dtEnd}`,
      `RRULE:FREQ=WEEKLY;UNTIL=${recurrenceEndStr}`,
      `BEGIN:VALARM`,
      `ACTION:DISPLAY`,
      `DESCRIPTION:Reminder: ${eventSummary}`,
      `TRIGGER:-PT${reminderMinutes}M`,
      `END:VALARM`,
      "END:VEVENT",
    ];
  };

  // Download the ICS file
  const downloadIcsFile = (icsContent: string[]) => {
    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${semester.replace(/\s+/g, "_")}_Schedule.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to render schedule section
  const renderScheduleSection = () => {
    return (
      <>
        <Card title="Your Class Schedule">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">{studentName}</h3>
              <p className="text-zinc-400">{semester}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={saveChanges}
                    className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                  >
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelEditing}
                    className="whitespace-nowrap"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={startEditing}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Schedule
                  </Button>
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
                </>
              )}
            </div>
          </div>

          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-amber-200/90 text-sm">
              This schedule is imported from your uploaded PDF file. While we
              strive for accuracy, some details like section numbers or room
              assignments might not be extracted correctly. You can use the Edit
              Schedule button above to manually fix any incorrect information.
            </p>
          </div>

          {/* Weekly Schedule Display */}
          {renderWeeklySchedule()}
        </Card>

        {/* Calendar Export Options */}
        {renderCalendarExportOptions()}
      </>
    );
  };

  // Helper function to render the weekly schedule grid
  const renderWeeklySchedule = () => {
    const timeSlots = generateTimeSlots();
    const scheduleToUse = isEditing ? editedSchedule : parsedSchedule;

    return (
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
                    ${timeIndex % 2 === 0 ? "bg-zinc-900/50" : "bg-zinc-900/30"}
                    border-b border-zinc-800/50
                  `}
                >
                  {timeSlot}
                </div>
              ))}
            </div>

            {/* Day columns with classes */}
            {weekdays.map((day) =>
              renderDayColumn(day, timeSlots, scheduleToUse)
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render a day column in the schedule
  const renderDayColumn = (
    day: string,
    timeSlots: string[],
    schedule: WeeklySchedule | null
  ) => {
    if (!schedule) return null;

    return (
      <div key={`day-${day}`} className="col-span-1 relative">
        {/* Time slot backgrounds */}
        {timeSlots.map((timeSlot, timeIndex) => (
          <div
            key={`bg-${day}-${timeSlot}`}
            className={`h-14 border-b border-zinc-800/50
              ${timeIndex % 2 === 0 ? "bg-zinc-900/50" : "bg-zinc-900/30"}
            `}
          />
        ))}

        {/* Classes */}
        {schedule[day]
          ?.filter((cls) => cls.day === day)
          .map((classSession, classIndex) =>
            renderClassItem(day, classSession, classIndex)
          )}
      </div>
    );
  };

  // Helper function to render a single class item in the schedule
  const renderClassItem = (
    day: string,
    classSession: ClassSession,
    classIndex: number
  ) => {
    const startMinutes = convertTimeToMinutes(classSession.startTime);
    const endMinutes = convertTimeToMinutes(classSession.endTime);
    const dayStartMinutes = convertTimeToMinutes("8:00 AM");
    const colorClass = getClassColor(classSession.courseCode);

    // Calculate position and height
    const topPosition = ((startMinutes - dayStartMinutes) / 30) * 56;
    const height = ((endMinutes - startMinutes) / 30) * 56;

    // Determine if this is a long class (more than 2 hours)
    const durationInHours = (endMinutes - startMinutes) / 60;
    const isLongClass = durationInHours >= 2;

    return (
      <div
        key={`class-${day}-${classIndex}`}
        className={`absolute left-1 right-1 ${colorClass} overflow-hidden shadow-lg backdrop-blur-sm border ${
          isEditing ? "border-white/30" : "border-white/10"
        } ${isEditing ? "cursor-pointer hover:brightness-110" : ""}`}
        style={{
          top: `${topPosition}px`,
          height: `${height}px`,
          zIndex: 5,
        }}
      >
        <div className="h-full p-2.5 text-white flex flex-col">
          {isEditing
            ? renderEditingClassContent(
                day,
                classIndex,
                classSession,
                isLongClass,
                height
              )
            : renderNormalClassContent(
                classSession,
                isLongClass,
                durationInHours
              )}
        </div>
      </div>
    );
  };

  // Helper function to render class content in editing mode
  const renderEditingClassContent = (
    day: string,
    classIndex: number,
    classSession: ClassSession,
    isLongClass: boolean,
    height: number
  ) => {
    return (
      <div className="flex flex-col gap-2 h-full overflow-y-auto">
        <input
          type="text"
          value={classSession.courseCode}
          onChange={(e) =>
            handleClassEdit(day, classIndex, "courseCode", e.target.value)
          }
          className="bg-black/20 text-white border border-white/30 px-2 py-1 rounded text-sm font-semibold w-full"
          placeholder="Course Code"
        />
        {isLongClass && (
          <input
            type="text"
            value={classSession.courseName}
            onChange={(e) =>
              handleClassEdit(day, classIndex, "courseName", e.target.value)
            }
            className="bg-black/20 text-white border border-white/30 px-2 py-1 rounded text-sm w-full"
            placeholder="Course Name"
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={classSession.section}
            onChange={(e) =>
              handleClassEdit(day, classIndex, "section", e.target.value)
            }
            className="bg-black/20 text-white border border-white/30 px-2 py-1 rounded text-xs w-1/2"
            placeholder="Section"
          />
          <select
            value={classSession.type}
            onChange={(e) =>
              handleClassEdit(day, classIndex, "type", e.target.value)
            }
            className="bg-black/20 text-white border border-white/30 px-2 py-1 rounded text-xs w-1/2"
          >
            <option value="Lecture">Lecture</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Tutorial">Tutorial</option>
          </select>
        </div>
        {(isLongClass || height > 80) && (
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2">
              <div className="text-[10px] text-white/70 font-medium">
                Start:
              </div>
              <select
                value={classSession.startTime}
                onChange={(e) =>
                  handleClassEdit(day, classIndex, "startTime", e.target.value)
                }
                className={`bg-black/20 text-white border ${
                  isValidTimeRange(classSession.startTime, classSession.endTime)
                    ? "border-white/30"
                    : "border-red-500/70"
                } px-2 py-1 rounded text-xs flex-1`}
              >
                {timeOptions.map((time) => {
                  // Don't allow start times that would be after the last possible end time
                  const isLastPossibleOption =
                    time === timeOptions[timeOptions.length - 1];
                  return (
                    <option
                      key={`start-${time}`}
                      value={time}
                      disabled={isLastPossibleOption}
                    >
                      {time}
                      {isLastPossibleOption ? " (invalid)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[10px] text-white/70 font-medium">End:</div>
              <select
                value={classSession.endTime}
                onChange={(e) =>
                  handleClassEdit(day, classIndex, "endTime", e.target.value)
                }
                className={`bg-black/20 text-white border ${
                  isValidTimeRange(classSession.startTime, classSession.endTime)
                    ? "border-white/30"
                    : "border-red-500/70"
                } px-2 py-1 rounded text-xs flex-1`}
              >
                {timeOptions.map((time) => {
                  // Calculate if this time option should be disabled
                  const disabled =
                    convertTimeToMinutes(time) <=
                    convertTimeToMinutes(classSession.startTime);
                  return (
                    <option
                      key={`end-${time}`}
                      value={time}
                      disabled={disabled}
                    >
                      {time}
                      {disabled ? " (invalid)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {!isValidTimeRange(
              classSession.startTime,
              classSession.endTime
            ) && (
              <div className="text-[10px] text-red-400 font-medium mt-1">
                End time must be after start time
              </div>
            )}
          </div>
        )}
        <input
          type="text"
          value={classSession.room}
          onChange={(e) =>
            handleClassEdit(day, classIndex, "room", e.target.value)
          }
          className="bg-black/20 text-white border border-white/30 px-2 py-1 rounded text-xs w-full"
          placeholder="Room"
        />
      </div>
    );
  };

  // Helper function to render class content in normal viewing mode
  const renderNormalClassContent = (
    classSession: ClassSession,
    isLongClass: boolean,
    durationInHours: number
  ) => {
    return (
      <>
        <div
          className={`font-semibold tracking-wide ${
            isLongClass ? "text-base mb-2" : ""
          }`}
        >
          {classSession.courseCode}-{classSession.section}
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
            isLongClass ? "text-sm mb-3" : "text-[11px] mt-1.5"
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
            isLongClass ? "gap-2 mt-auto text-sm" : "gap-0.5 mt-2"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${isLongClass ? "h-4 w-4" : "h-3 w-3"}`}
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
            {classSession.startTime} - {classSession.endTime}
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${isLongClass ? "h-4 w-4" : "h-3 w-3"}`}
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
      </>
    );
  };

  // Helper function to render the calendar export options
  const renderCalendarExportOptions = () => {
    return (
      <Card title="Calendar Export Options">
        <div className="space-y-6">
          <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <p className="text-zinc-400 text-sm">
              Configure your calendar export settings below. The generated .ics
              file can be imported into Google Calendar, Apple Calendar,
              Outlook, and other calendar applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semester Dates Section */}
            <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <h3 className="text-white font-medium mb-4">Semester Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={semesterStartDate}
                    onChange={(e) => setSemesterStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={semesterEndDate}
                    onChange={(e) => setSemesterEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Calendar Settings Section */}
            <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <h3 className="text-white font-medium mb-4">Reminder Settings</h3>
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                  Remind me
                </label>
                <Select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full"
                >
                  <option value="30 minutes">30 minutes before class</option>
                  <option value="1 hour">1 hour before class</option>
                  <option value="2 hours">2 hours before class</option>
                  <option value="1 day">1 day before class</option>
                  <option value="none">Don't remind me</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Event Display Section */}
          <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <h3 className="text-white font-medium mb-4">Event Display</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="displayPreference"
                    value="code"
                    checked={displayPreference === "code"}
                    onChange={() => setDisplayPreference("code")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border transition-colors ${
                      displayPreference === "code"
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-600 group-hover:border-zinc-500"
                    } mr-2 flex items-center justify-center`}
                  >
                    {displayPreference === "code" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-zinc-300">Course Code</span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="displayPreference"
                    value="name"
                    checked={displayPreference === "name"}
                    onChange={() => setDisplayPreference("name")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border transition-colors ${
                      displayPreference === "name"
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-600 group-hover:border-zinc-500"
                    } mr-2 flex items-center justify-center`}
                  >
                    {displayPreference === "name" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-zinc-300">Course Name</span>
                </label>
              </div>

              <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="text-sm font-medium text-white mb-2">
                  {parsedSchedule &&
                  parsedSchedule.Monday &&
                  parsedSchedule.Monday[0]
                    ? displayPreference === "code"
                      ? `${parsedSchedule.Monday[0].courseCode}-${parsedSchedule.Monday[0].section} ${parsedSchedule.Monday[0].type}`
                      : `${parsedSchedule.Monday[0].courseName} ${parsedSchedule.Monday[0].type}`
                    : displayPreference === "code"
                    ? "INFT 2102-01 Lecture"
                    : "Software Project Management Lecture"}
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {parsedSchedule &&
                      parsedSchedule.Monday &&
                      parsedSchedule.Monday[0]
                        ? `Monday, ${parsedSchedule.Monday[0].startTime} - ${parsedSchedule.Monday[0].endTime}`
                        : "Monday, 10:00 AM - 11:30 AM"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {parsedSchedule &&
                      parsedSchedule.Monday &&
                      parsedSchedule.Monday[0]
                        ? `Room ${parsedSchedule.Monday[0].room}`
                        : "Room 12.01.2"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <p className="text-xs text-zinc-500">
                    This is a preview of how your classes will appear in your
                    calendar app. Each class will be added as a recurring event
                    with the format shown above.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={generateICS} className="px-6">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Calendar File (.ics)
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6">
          {/* Main content */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {/* Upload Section */}
            <Card title="Class Schedule Maker">
              <div className="flex flex-col items-center justify-center">
                <p className="text-zinc-400 text-sm max-w-xl text-center mb-8">
                  Upload your PeopleSoft schedule PDF to create a calendar file
                  that syncs with your preferred calendar app.
                </p>

                <div
                  className={`w-full max-w-xl mx-auto border-2 border-dashed rounded-lg ${
                    parsedSchedule
                      ? "border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10"
                      : "border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/50"
                  } p-8 text-center transition-all duration-300 cursor-pointer`}
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
                    <div className="py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-zinc-400 text-sm">
                        Processing your schedule...
                      </p>
                    </div>
                  ) : parsedSchedule ? (
                    <div className="py-2">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-400"
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
                      <p className="text-blue-400 font-medium mb-1">
                        Schedule uploaded successfully
                      </p>
                      <p className="text-zinc-500 text-sm">
                        Click or drag to upload a different file
                      </p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="w-12 h-12 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-zinc-400"
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
                      </div>
                      <p className="text-zinc-300 font-medium mb-2">
                        Drop your schedule PDF here
                      </p>
                      <p className="text-zinc-500 text-sm">
                        or click to browse your files
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Schedule Display */}
            {renderScheduleSection()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
