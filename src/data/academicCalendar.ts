export type CalendarEvent = {
  nameEn: string;
  nameAr: string;
  date: string | string[];
  type?: "holiday" | "academic" | "exam" | "registration" | "deadline";
  tentative?: boolean;
};

export type SemesterData = {
  id: string;
  nameEn: string;
  nameAr: string;
  events: CalendarEvent[];
};

export type AcademicYear = {
  id: string;
  nameEn: string;
  nameAr: string;
  semesters: SemesterData[];
};

export const academicCalendarData: AcademicYear[] = [
  {
    id: "2025-2026",
    nameEn: "Academic Year 2025/2026",
    nameAr: "التقويم الأكاديمي 2026/2025",
    semesters: [
      {
        id: "fall-2025",
        nameEn: "Fall Semester (2025)",
        nameAr: "فصل الخريف الدراسي (2025)",
        events: [
          { nameEn: "Program Transfer Requests Open for Students", nameAr: "فتح طلبات تغيير البرنامج للطلاب", date: ["2025-06-01", "2025-06-17"], type: "registration" },
          { nameEn: "Registration Opens", nameAr: "فتح باب التسجيل", date: "2025-06-15", type: "registration" },
          { nameEn: "Last Day to Register", nameAr: "آخر يوم للتسجيل", date: "2025-08-18", type: "deadline" },
          { nameEn: "Appeal Application Submission Deadline, 3 pm", nameAr: "الموعد النهائي لتقديم طلب الاستئناف الساعة 3 عصراً", date: "2025-08-19", type: "deadline" },
          { nameEn: "Appeal Hearings", nameAr: "جلسات الاستئناف", date: ["2025-08-20", "2025-08-21"], type: "academic" },
          { nameEn: "Start of Term / Faculty Return Date", nameAr: "بداية الفصل الدراسي/عودة الهيئة التعليمية", date: "2025-08-24", type: "academic" },
          { nameEn: "First Day of Classes", nameAr: "اليوم الأول للمحاضرات", date: "2025-08-26", type: "academic" },
          { nameEn: "Start of Add / Drop Period", nameAr: "بداية فترة الحذف والإضافة", date: "2025-08-26", type: "registration" },
          { nameEn: "End of Add / Drop Period", nameAr: "نهاية فترة الحذف والإضافة", date: "2025-09-01", type: "deadline" },
          { nameEn: "Last Day to Withdraw with Full Fees Refund", nameAr: "آخر يوم للانسحاب مع استرداد كامل للرسوم", date: "2025-09-01", type: "deadline" },
          { nameEn: "Last Day to Withdraw with Prorated Fees Refund", nameAr: "آخر يوم للانسحاب مع استرداد جزئي للرسوم", date: "2025-09-22", type: "deadline" },
          { nameEn: "Midterm Break", nameAr: "إجازة منتصف الفصل الدراسي", date: ["2025-10-12", "2025-10-16"], type: "holiday" },
          { nameEn: "Midterm Exams", nameAr: "اختبارات منتصف الفصل الدراسي", date: ["2025-10-17", "2025-10-25"], type: "exam" },
          { nameEn: "Last Day to Drop a Course / Withdraw from Semester", nameAr: "آخر يوم لحذف المواد/الانسحاب من الفصل الدراسي", date: "2025-11-02", type: "deadline" },
          { nameEn: "Last Day of Classes", nameAr: "آخر يوم للمحاضرات", date: "2025-12-04", type: "academic" },
          { nameEn: "Final Exams", nameAr: "امتحانات نهاية الفصل", date: ["2025-12-07", "2025-12-15"], type: "exam" },
          { nameEn: "End of Term", nameAr: "نهاية الفصل الدراسي", date: "2025-12-17", type: "academic" },
          { nameEn: "Qatar National Day (1 Day)", nameAr: "اليوم الوطني (يوم واحد)", date: "2025-12-18", type: "holiday" },
          { nameEn: "Grades Released to Students (Fall)", nameAr: "إصدار الدرجات للطلاب (فصل الخريف الدراسي)", date: "2025-12-25", type: "academic" },
        ],
      },
      {
        id: "winter-2026",
        nameEn: "Winter Semester (2026)",
        nameAr: "فصل الشتاء الدراسي (2026)",
        events: [
          { nameEn: "Program Transfer Requests Open for Students", nameAr: "فتح طلبات تغيير البرنامج للطلاب", date: ["2025-11-09", "2025-11-20"], type: "registration" },
          { nameEn: "Registration Opens", nameAr: "فتح باب التسجيل", date: "2025-11-16", type: "registration" },
          { nameEn: "Last Day to Register", nameAr: "آخر يوم للتسجيل", date: "2025-12-11", type: "deadline" },
          { nameEn: "Start of Add / Drop Period", nameAr: "بداية فترة الحذف والإضافة", date: "2025-12-25", type: "registration" },
          { nameEn: "Appeal Application Submission Deadline, 3 pm", nameAr: "الموعد النهائي لتقديم طلب الاستئناف الساعة 3 عصراً", date: "2026-01-01", type: "deadline" },
          { nameEn: "Start of Winter Term / Faculty Return Date", nameAr: "بداية الفصل الدراسي/عودة الهيئة التعليمية", date: "2026-01-04", type: "academic" },
          { nameEn: "Appeal Hearings", nameAr: "جلسات الاستئناف", date: ["2026-01-04", "2026-01-05"], type: "academic" },
          { nameEn: "First Day of Classes", nameAr: "اليوم الأول للمحاضرات", date: "2026-01-06", type: "academic" },
          { nameEn: "End of Add / Drop Period", nameAr: "نهاية فترة الحذف والإضافة", date: "2026-01-12", type: "deadline" },
          { nameEn: "Last Day to Withdraw with Full Fees Refund", nameAr: "آخر يوم للانسحاب مع استرداد كامل للرسوم", date: "2026-01-12", type: "deadline" },
          { nameEn: "Last Day to Withdraw with Prorated Fees Refund", nameAr: "آخر يوم للانسحاب مع استرداد جزئي للرسوم", date: "2026-02-02", type: "deadline" },
          { nameEn: "Qatar National Sports Day", nameAr: "اليوم الرياضي للدولة", date: "2026-02-10", type: "holiday" },
          { nameEn: "Ramadan Days *Tentative", nameAr: "شهر رمضان المبارك* مبدئياً", date: ["2026-02-18", "2026-03-19"], type: "holiday", tentative: true },
          { nameEn: "Midterm Exams", nameAr: "اختبارات منتصف الفصل", date: ["2026-02-21", "2026-02-28"], type: "exam" },
          { nameEn: "Last Day to Drop a Course / Withdraw from Semester", nameAr: "آخر يوم لحذف المواد/الانسحاب من الفصل الدراسي", date: "2026-03-08", type: "deadline" },
          { nameEn: "Eid Al-Fitr Holiday (7 Days) *Tentative", nameAr: "عيد الفطر المبارك (7 أيام)* مبدئياً", date: ["2026-03-17", "2026-03-23"], type: "holiday", tentative: true },
          { nameEn: "Skills Day", nameAr: "يوم المهارات", date: "2026-04-01", type: "academic" },
          { nameEn: "Last Day of Classes", nameAr: "آخر يوم للمحاضرات", date: "2026-04-14", type: "academic" },
          { nameEn: "Final Exams", nameAr: "امتحانات نهاية الفصل", date: ["2026-04-17", "2026-04-25"], type: "exam" },
          { nameEn: "End of Term", nameAr: "نهاية الفصل الدراسي", date: "2026-04-26", type: "academic" },
          { nameEn: "Grades Released to Students (Winter)", nameAr: "إصدار الدرجات للطلاب (فصل الشتاء الدراسي)", date: "2026-04-30", type: "academic" },
        ],
      },
      {
        id: "spring-2026",
        nameEn: "Spring Semester (2026)",
        nameAr: "فصل الربيع الدراسي (2026)",
        events: [
          { nameEn: "Registration Opens", nameAr: "فتح باب التسجيل", date: "2026-03-29", type: "registration" },
          { nameEn: "Last Day to Register", nameAr: "آخر يوم للتسجيل", date: "2026-04-23", type: "deadline" },
          { nameEn: "Start of Spring Term / Faculty Return Date", nameAr: "بداية الفصل الدراسي / عودة الهيئة التعليمية", date: "2026-05-03", type: "academic" },
          { nameEn: "Start of Add / Drop Period", nameAr: "بداية فترة الحذف والإضافة", date: "2026-05-03", type: "registration" },
          { nameEn: "First Day of Classes", nameAr: "اليوم الأول للمحاضرات", date: "2026-05-03", type: "academic" },
          { nameEn: "Appeal Application Submission Deadline, 3 pm", nameAr: "الموعد النهائي لتقديم طلب الاستئناف الساعة 3 عصراً", date: "2026-05-03", type: "deadline" },
          { nameEn: "Appeal Hearings", nameAr: "جلسات الاستئناف", date: ["2026-05-04", "2026-05-05"], type: "academic" },
          { nameEn: "End of Add / Drop Period", nameAr: "نهاية فترة الحذف والإضافة", date: ["2026-05-04", "2026-05-05"], type: "deadline" },
          { nameEn: "Last Day to Withdraw with Full Fees Refund", nameAr: "آخر يوم للانسحاب مع استرداد كامل للرسوم", date: "2026-05-07", type: "deadline" },
          { nameEn: "Graduation Day 1", nameAr: "حفل التخرج - اليوم الأول", date: "2026-05-19", type: "academic" },
          { nameEn: "Graduation Day 2", nameAr: "حفل التخرج - اليوم الثاني", date: "2026-05-20", type: "academic" },
          { nameEn: "Graduation Day 3", nameAr: "حفل التخرج - اليوم الثالث", date: "2026-05-21", type: "academic" },
          { nameEn: "Last Day to Withdraw with Prorated Fees Refund", nameAr: "آخر يوم للانسحاب مع استرداد جزئي للرسوم", date: "2026-05-21", type: "deadline" },
          { nameEn: "Last Day to Drop a Course / Withdraw from Semester", nameAr: "آخر يوم لحذف المواد/الانسحاب من الفصل الدراسي", date: "2026-05-21", type: "deadline" },
          { nameEn: "Eid Al-Adha Holiday (5 Days) *Tentative", nameAr: "عيد الأضحى المبارك (5 أيام)* مبدئياً", date: ["2026-05-26", "2026-05-30"], type: "holiday", tentative: true },
          { nameEn: "Last Day of Classes", nameAr: "آخر يوم للمحاضرات", date: "2026-06-23", type: "academic" },
          { nameEn: "Final Exams", nameAr: "الاختبارات النهائية", date: ["2026-06-24", "2026-06-29"], type: "exam" },
          { nameEn: "End of Term", nameAr: "نهاية الفصل الدراسي", date: "2026-06-30", type: "academic" },
          { nameEn: "Grades Released to Students (Spring)", nameAr: "إصدار الدرجات للطلاب (فصل الربيع الدراسي)", date: "2026-07-07", type: "academic" },
        ],
      },
    ],
  },
  {
    id: "2026-2027",
    nameEn: "Academic Year 2026/2027",
    nameAr: "التقويم الأكاديمي 2026/2025",
    semesters: [
      {
        id: "fall-2026",
        nameEn: "Fall Semester (2026)",
        nameAr: "فصل الخريف الدراسي (2026)",
        events: [
          { nameEn: "Program Transfer Requests Open for Students", nameAr: "فتح طلبات تغيير البرنامج للطلاب", date: ["2026-06-07", "2026-06-16"], type: "registration" },
          { nameEn: "Registration Opens", nameAr: "فتح باب التسجيل", date: "2026-06-28", type: "registration" },
          { nameEn: "Start of Fall Term / Faculty Return Date", nameAr: "بداية فصل الخريف الدراسي / عودة الهيئة التعليمية", date: "2026-08-23", type: "academic" },
        ],
      },
    ],
  },
];
