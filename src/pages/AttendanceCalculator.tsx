import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

type ClassInfo = {
  duration: number;
  missedTimes: number | string;
};

export default function AttendanceCalculator() {
  const locale = useLocale();
  const [absenteeismPercentage, setAbsenteeismPercentage] =
    useState<string>("");
  const [weeksInSemester, setWeeksInSemester] = useState<string>("14");
  const [classesPerWeek, setClassesPerWeek] = useState<number>(0);
  const [classInfos, setClassInfos] = useState<ClassInfo[]>([]);
  const [newAbsenteeismPercentage, setNewAbsenteeismPercentage] =
    useState<number>(0);

  // Initialize class infos when number of classes changes
  useEffect(() => {
    let newClassInfos: ClassInfo[] = [];

    if (classesPerWeek > classInfos.length) {
      // Adding new classes
      newClassInfos = [
        ...classInfos,
        ...Array(classesPerWeek - classInfos.length)
          .fill(null)
          .map(() => ({
            duration: 60,
            missedTimes: 0,
          })),
      ];
    } else {
      // Removing classes or keeping the same number
      newClassInfos = classInfos.slice(0, classesPerWeek);
    }

    setClassInfos(newClassInfos);
  }, [classesPerWeek]);

  // Calculate attendance whenever inputs change
  useEffect(() => {
    calculateAttendance();
  }, [absenteeismPercentage, weeksInSemester, classInfos]);

  const updateClassInfo = (
    index: number,
    field: keyof ClassInfo,
    value: number | string
  ) => {
    const updatedClassInfos = [...classInfos];

    // Ensure valid values
    if (field === "duration" && typeof value === "number") {
      value = Math.max(0, value);
    }

    if (field === "missedTimes" && typeof value === "number") {
      value = Math.max(0, value);
    }

    updatedClassInfos[index] = {
      ...updatedClassInfos[index],
      [field]: value,
    };

    setClassInfos(updatedClassInfos);
  };

  const calculateAttendance = () => {
    const currentAbsenteeismPercentage = parseFloat(absenteeismPercentage) || 0;
    const weeks = parseInt(weeksInSemester) || 0;

    let totalClassMinutes = 0;
    let totalMissedMinutes = 0;

    classInfos.forEach((classInfo) => {
      const classDurationMinutes = classInfo.duration || 0;
      totalClassMinutes += classDurationMinutes * weeks;

      let missedMinutes = 0;
      if (typeof classInfo.missedTimes === "number") {
        missedMinutes = classInfo.missedTimes * classDurationMinutes;
      } else if (typeof classInfo.missedTimes === "string") {
        missedMinutes = parseInt(classInfo.missedTimes) || 0;
      }

      totalMissedMinutes += missedMinutes;
    });

    // Calculate new absenteeism percentage
    let calculatedPercentage = currentAbsenteeismPercentage;
    if (totalClassMinutes > 0) {
      calculatedPercentage += (totalMissedMinutes / totalClassMinutes) * 100;
    }

    setNewAbsenteeismPercentage(calculatedPercentage);
  };


  const handleCustomInput = (index: number) => {
    const updatedClassInfos = [...classInfos];
    updatedClassInfos[index].missedTimes = "";
    setClassInfos(updatedClassInfos);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{
              en: "Attendance Calculator",
              ar: "حاسبة الحضور"
            }}
            description={{
              en: "Track your class attendance, calculate absence percentages, and plan your remaining absences within the allowed limits.",
              ar: "تتبع حضورك في المحاضرات، احسب نسب الغياب، وخطط لغياباتك المتبقية ضمن الحدود المسموح بها."
            }}
          />

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Input Sections */}
            <div className="space-y-6 md:space-y-8 h-full flex flex-col">
              {/* Basic Information Card */}
              <Card
                title={
                  locale === "ar" ? "معلومات الحضور" : "Attendance Information"
                }
                className="relative"
              >
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <Input
                      label={
                        locale === "ar"
                          ? "نسبة الغياب"
                          : "Absenteeism Percentage"
                      }
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder={locale === "ar" ? "مثال: 3.5" : "e.g. 3.5"}
                      value={absenteeismPercentage}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (e.target.value === "" || isNaN(value)) {
                          setAbsenteeismPercentage("");
                        } else {
                          setAbsenteeismPercentage(
                            Math.max(0, Math.min(100, value)).toString()
                          );
                        }
                      }}
                      helperText={
                        locale === "ar"
                          ? "0 إذا لم تتغيب عن أي محاضرة من قبل"
                          : "0 if you haven't missed any class before"
                      }
                    />

                    <Input
                      label={
                        locale === "ar"
                          ? "عدد الأسابيع في الفصل"
                          : "Total Weeks in Semester"
                      }
                      type="number"
                      min="1"
                      step="1"
                      placeholder={locale === "ar" ? "مثال: 14" : "e.g. 14"}
                      value={weeksInSemester}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (e.target.value === "" || isNaN(value)) {
                          setWeeksInSemester("");
                        } else {
                          setWeeksInSemester(Math.max(1, value).toString());
                        }
                      }}
                      helperText={
                        locale === "ar"
                          ? "14 أسبوع للفصل الخريفي/الشتوي، 6 أسابيع للفصل الصيفي"
                          : "14 weeks for Fall/Winter semesters, 6 weeks for Spring semester"
                      }
                    />
                  </div>

                  <Select
                    label={
                      locale === "ar"
                        ? "المحاضرات في الأسبوع"
                        : "Classes per Week"
                    }
                    value={classesPerWeek}
                    onChange={(e) =>
                      setClassesPerWeek(parseInt(e.target.value))
                    }
                    helperText={
                      locale === "ar"
                        ? "عدد المحاضرات التي تأخذها كل أسبوع"
                        : "The number of classes you take each week"
                    }
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num === 0
                          ? locale === "ar"
                            ? "اختر عددًا"
                            : "Choose a number"
                          : locale === "ar"
                          ? `${num} ${num === 1 ? "محاضرة" : "محاضرات"}`
                          : `${num} ${num === 1 ? "Class" : "Classes"}`}
                      </option>
                    ))}
                  </Select>
                </form>
              </Card>

              {/* Classes Information Card */}
              <Card
                title={
                  locale === "ar" ? "معلومات المحاضرات" : "Classes Information"
                }
                className="bg-zinc-900/70 backdrop-blur-sm ring-1 ring-zinc-800/50 flex-1 relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px]"
              >
                {classesPerWeek === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-3 text-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-zinc-600 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <p className="text-zinc-400 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                      {locale === "ar"
                        ? "لم يتم اختيار محاضرات"
                        : "No Classes Selected"}
                    </p>
                    <p className="text-zinc-500 text-xs sm:text-sm max-w-[180px] sm:max-w-[250px]">
                      {locale === "ar"
                        ? "اختر عدد المحاضرات التي تأخذها كل أسبوع"
                        : "Choose the number of classes you take each week"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 h-full overflow-y-auto px-1 sm:px-0">
                    <p className="text-sm text-zinc-400">
                      {locale === "ar"
                        ? "مدة المحاضرات / عدد مرات الغياب المخطط لها"
                        : "Classes Duration / Number of times you plan to miss it"}
                    </p>
                    {classInfos.map((classInfo, index) => (
                      <div
                        key={index}
                        className="p-4 sm:p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-lg space-y-4 sm:space-y-6"
                      >
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <h3 className="text-sm font-semibold text-blue-400">
                            {locale === "ar"
                              ? `المحاضرة ${index + 1}`
                              : `Class ${index + 1}`}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <Select
                            label={locale === "ar" ? "المدة" : "Duration"}
                            value={classInfo.duration}
                            onChange={(e) =>
                              updateClassInfo(
                                index,
                                "duration",
                                parseInt(e.target.value)
                              )
                            }
                          >
                            <option value={30}>
                              {locale === "ar" ? "30 دقيقة" : "30 minutes"}
                            </option>
                            <option value={60}>
                              {locale === "ar" ? "ساعة واحدة" : "1 hour"}
                            </option>
                            <option value={90}>
                              {locale === "ar" ? "ساعة ونصف" : "1.5 hours"}
                            </option>
                            <option value={120}>
                              {locale === "ar" ? "ساعتان" : "2 hours"}
                            </option>
                            <option value={150}>
                              {locale === "ar" ? "ساعتان ونصف" : "2.5 hours"}
                            </option>
                            <option value={180}>
                              {locale === "ar" ? "3 ساعات" : "3 hours"}
                            </option>
                          </Select>

                          {typeof classInfo.missedTimes === "number" ? (
                            <Select
                              label={
                                locale === "ar"
                                  ? "مرات الغياب"
                                  : "Missed Classes"
                              }
                              value={classInfo.missedTimes}
                              onChange={(e) => {
                                if (e.target.value === "custom") {
                                  handleCustomInput(index);
                                } else {
                                  updateClassInfo(
                                    index,
                                    "missedTimes",
                                    parseInt(e.target.value)
                                  );
                                }
                              }}
                            >
                              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                  {locale === "ar"
                                    ? `${num} ${
                                        num === 0
                                          ? "مرة"
                                          : num === 1
                                          ? "مرة"
                                          : "مرات"
                                      }`
                                    : `${num} ${num === 1 ? "time" : "times"}`}
                                </option>
                              ))}
                              <option value="custom">
                                {locale === "ar" ? "تخصيص" : "Custom"}
                              </option>
                            </Select>
                          ) : (
                            <Input
                              label={
                                locale === "ar"
                                  ? "دقائق الغياب المخصصة"
                                  : "Custom Missed Minutes"
                              }
                              type="number"
                              min="0"
                              placeholder={
                                locale === "ar"
                                  ? "أدخل الدقائق"
                                  : "Enter minutes"
                              }
                              value={classInfo.missedTimes}
                              onChange={(e) => {
                                const value = e.target.value;
                                updateClassInfo(index, "missedTimes", value);
                              }}
                              helperText={
                                locale === "ar"
                                  ? "أدخل إجمالي الدقائق التي تغيبت عنها"
                                  : "Enter total minutes missed"
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Results Section */}
            <div className="space-y-8">
              <Card
                title={locale === "ar" ? "نتائج الحساب" : "Calculation Results"}
                className="h-full"
              >
                <div className="text-center mb-6 md:mb-8">
                  <div className="inline-flex items-baseline">
                    <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                      {newAbsenteeismPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm md:text-base mt-3">
                    {locale === "ar"
                      ? "نسبة الغياب الجديدة"
                      : "New Absenteeism Percentage"}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-zinc-800">
                          {locale === "ar" ? "مستوى الغياب" : "Absence Level"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-zinc-800">
                          15%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-zinc-800">
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (newAbsenteeismPercentage / 15) * 100
                          )}%`,
                        }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300 ease-in-out ${
                          newAbsenteeismPercentage <= 5
                            ? "bg-blue-500"
                            : newAbsenteeismPercentage <= 10
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`text-sm font-medium transition-colors duration-300 ease-in-out ${
                          newAbsenteeismPercentage <= 5
                            ? "text-blue-500"
                            : newAbsenteeismPercentage <= 10
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {newAbsenteeismPercentage <= 5
                          ? locale === "ar"
                            ? "حضور ممتاز!"
                            : "Excellent attendance!"
                          : newAbsenteeismPercentage <= 10
                          ? locale === "ar"
                            ? "كن حذراً مع الغياب"
                            : "Be cautious with absences"
                          : newAbsenteeismPercentage >= 15
                          ? locale === "ar"
                            ? "تحذير: تم تجاوز الحد"
                            : "Critical: Limit exceeded"
                          : locale === "ar"
                          ? "تحذير: قريب من الحد"
                          : "Warning: Near limit"}
                      </div>
                    </div>
                  </div>

                  {/* Classes Left Section */}
                  <>
                    <div className="h-px bg-zinc-800/50 my-6"></div>

                    <div>
                      <h3 className="text-base font-semibold text-white mb-2">
                        {locale === "ar"
                          ? "كم محاضرة متبقية؟"
                          : "How Many Classes Left?"}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-4">
                        {locale === "ar"
                          ? "يوضح هذا عدد المحاضرات المتبقية التي يمكنك التغيب عنها قبل الوصول إلى حد الغياب 15%. فكر في الاحتفاظ ببعضها للطوارئ."
                          : "This shows the remaining classes you can miss before reaching the 15% absence limit. Consider saving some for emergencies."}
                      </p>

                      {classesPerWeek === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-zinc-600 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                          </svg>
                          <p className="text-zinc-400 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                            {locale === "ar"
                              ? "لم تتم إضافة محاضرات"
                              : "No Classes Added"}
                          </p>
                          <p className="text-zinc-500 text-xs sm:text-sm max-w-[180px] sm:max-w-[250px]">
                            {locale === "ar"
                              ? "أضف المحاضرات أعلاه لمعرفة عدد المرات التي يمكنك التغيب فيها"
                              : "Add classes above to see how many you can still miss"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 divide-y divide-zinc-800/50">
                          {classInfos.map((classInfo, index) => {
                            // Calculate how many more classes can be missed
                            const totalMinutesInSemester =
                              (classInfo.duration || 0) *
                              parseInt(weeksInSemester || "0");
                            const maxMissedMinutes =
                              totalMinutesInSemester * 0.15;

                            // Current missed minutes
                            let currentMissedMinutes = 0;
                            if (typeof classInfo.missedTimes === "number") {
                              currentMissedMinutes =
                                classInfo.missedTimes *
                                (classInfo.duration || 0);
                            } else {
                              currentMissedMinutes = parseInt(
                                classInfo.missedTimes || "0"
                              );
                            }

                            // Current absenteeism percentage for this class
                            const classAbsenteeismPercentage =
                              totalMinutesInSemester > 0
                                ? (currentMissedMinutes /
                                    totalMinutesInSemester) *
                                  100
                                : 0;

                            // Calculate remaining minutes and classes
                            const remainingMinutes = Math.max(
                              0,
                              maxMissedMinutes - currentMissedMinutes
                            );
                            const remainingClasses =
                              classInfo.duration > 0
                                ? Math.floor(
                                    remainingMinutes / classInfo.duration
                                  )
                                : 0;

                            return (
                              <div
                                key={index}
                                className="p-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-white">
                                    <span className="text-sm font-medium">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-zinc-200">
                                      {locale === "ar"
                                        ? `المحاضرة ${index + 1}`
                                        : `Class ${index + 1}`}
                                    </span>
                                    <div className="text-xs text-zinc-500">
                                      {locale === "ar"
                                        ? `${classInfo.duration} دقيقة لكل محاضرة`
                                        : `${classInfo.duration} minutes per session`}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      newAbsenteeismPercentage >= 15 ||
                                      classAbsenteeismPercentage >= 15
                                        ? "bg-red-500/10 text-red-400"
                                        : classAbsenteeismPercentage >= 10
                                        ? "bg-yellow-500/10 text-yellow-400"
                                        : "bg-blue-500/10 text-blue-400"
                                    }`}
                                  >
                                    {newAbsenteeismPercentage >= 15 ||
                                    classAbsenteeismPercentage >= 15
                                      ? locale === "ar"
                                        ? "تم تجاوز الحد"
                                        : "Limit exceeded"
                                      : locale === "ar"
                                      ? `${remainingClasses} ${
                                          remainingClasses === 1
                                            ? "محاضرة"
                                            : "محاضرات"
                                        } متبقية`
                                      : `${remainingClasses} ${
                                          remainingClasses === 1
                                            ? "class"
                                            : "classes"
                                        } left`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
