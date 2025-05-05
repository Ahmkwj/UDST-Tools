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
    id: "2024-2025",
    nameEn: "Academic Year 2024/2025",
    nameAr: "السنة الأكاديمية 2024/2025",
    semesters: [
      {
        id: "fall-2024",
        nameEn: "Fall Semester 2024",
        nameAr: "فصل الخريف الدراسي 2024",
        events: [
          {
            nameEn: "Registration Opens",
            nameAr: "فتح باب التسجيل",
            date: "2024-06-02",
            type: "registration",
            tentative: true,
          },
          {
            nameEn: "Last Day to Register",
            nameAr: "آخر يوم للتسجيل",
            date: "2024-08-19",
            type: "deadline",
          },
          {
            nameEn: "Appeal Application Submission Deadline",
            nameAr: "الموعد النهائي لتقديم طلب الاستئناف",
            date: "2024-08-20",
            type: "deadline",
          },
          {
            nameEn: "Appeal Hearings",
            nameAr: "جلسات الاستئناف",
            date: ["2024-08-21", "2024-08-22"],
            type: "academic",
          },
          {
            nameEn: "Start of Term / Faculty Return Date",
            nameAr: "بداية الفصل الدراسي/عودة الهيئة التعليمية",
            date: "2024-08-25",
            type: "academic",
          },
          {
            nameEn: "First Day of Classes",
            nameAr: "أول يوم دراسي",
            date: "2024-08-27",
            type: "academic",
          },
          {
            nameEn: "Start of Add / Drop Period",
            nameAr: "بداية فترة الحذف والإضافة",
            date: "2024-08-27",
            type: "registration",
          },
          {
            nameEn: "End of Add / Drop Period",
            nameAr: "نهاية فترة الحذف والإضافة",
            date: "2024-09-02",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Withdraw with Full Fees Refund",
            nameAr: "آخر يوم للانسحاب مع استرداد كامل للرسوم",
            date: "2024-09-02",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Withdraw with Prorated Fees Refund",
            nameAr: "آخر يوم للانسحاب مع استرداد جزئي للرسوم",
            date: "2024-09-23",
            type: "deadline",
          },
          {
            nameEn: "Midterm Exam Days",
            nameAr: "اختبارات منتصف الفصل الدراسي",
            date: ["2024-10-13", "2024-10-19"],
            type: "exam",
          },
          {
            nameEn: "Last Day to Drop a Course / Withdraw from Semester",
            nameAr: "آخر يوم لحذف المواد/الانسحاب من الفصل الدراسي",
            date: "2024-10-24",
            type: "deadline",
          },
          {
            nameEn: "Last Day of Classes",
            nameAr: "آخر يوم دراسي",
            date: "2024-12-03",
            type: "academic",
          },
          {
            nameEn: "Final Exam Days",
            nameAr: "الاختبارات النهائية",
            date: ["2024-12-06", "2024-12-14"],
            type: "exam",
          },
          {
            nameEn: "End of Term",
            nameAr: "نهاية الفصل الدراسي",
            date: "2024-12-15",
            type: "academic",
          },
          {
            nameEn: "Qatar National Day",
            nameAr: "اليوم الوطني",
            date: "2024-12-18",
            type: "holiday",
          },
          {
            nameEn: "Grades Released to Students",
            nameAr: "إصدار الدرجات للطلاب",
            date: "2024-12-19",
            type: "academic",
            tentative: true,
          },
        ],
      },
      {
        id: "winter-2025",
        nameEn: "Winter Semester 2025",
        nameAr: "فصل الشتاء الدراسي 2025",
        events: [
          {
            nameEn: "Registration Opens",
            nameAr: "فتح باب التسجيل",
            date: "2024-11-10",
            type: "registration",
          },
          {
            nameEn: "Last Day to Register",
            nameAr: "آخر يوم للتسجيل",
            date: "2024-12-15",
            type: "deadline",
          },
          {
            nameEn: "Start of Add / Drop Period",
            nameAr: "بداية فترة الحذف والإضافة",
            date: "2024-12-19",
            type: "registration",
          },
          {
            nameEn: "Appeal Application Submission Deadline",
            nameAr: "الموعد النهائي لتقديم طلب الاستئناف",
            date: "2024-12-26",
            type: "deadline",
          },
          {
            nameEn: "Start of Winter Term / Faculty Return Date",
            nameAr: "بداية الفصل الدراسي/عودة الهيئة التعليمية",
            date: "2024-12-29",
            type: "academic",
          },
          {
            nameEn: "Appeal Hearings",
            nameAr: "جلسات الاستئناف",
            date: ["2024-12-29", "2024-12-30"],
            type: "academic",
          },
          {
            nameEn: "First Day of Classes",
            nameAr: "أول يوم دراسي",
            date: "2024-12-31",
            type: "academic",
          },
          {
            nameEn: "End of Add / Drop Period",
            nameAr: "نهاية فترة الحذف والإضافة",
            date: "2025-01-06",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Withdraw with Full Fees Refund",
            nameAr: "آخر يوم للانسحاب مع استرداد كامل للرسوم",
            date: "2025-01-06",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Withdraw with Prorated Fees Refund",
            nameAr: "آخر يوم للانسحاب مع استرداد جزئي للرسوم",
            date: "2025-01-27",
            type: "deadline",
          },
          {
            nameEn: "Qatar National Sports Day",
            nameAr: "اليوم الرياضي للدولة",
            date: "2025-02-11",
            type: "holiday",
          },
          {
            nameEn: "Midterm Exam Days",
            nameAr: "اختبارات منتصف الفصل الدراسي",
            date: ["2025-02-16", "2025-02-22"],
            type: "exam",
          },
          {
            nameEn: "Last Day to Drop a Course / Withdraw from Semester",
            nameAr: "آخر يوم لحذف المواد/الانسحاب من الفصل الدراسي",
            date: "2025-02-27",
            type: "deadline",
          },
          {
            nameEn: "Ramadan Days",
            nameAr: "شهر رمضان",
            date: ["2025-02-28", "2025-03-29"],
            type: "holiday",
            tentative: true,
          },
          {
            nameEn: "Eid Al-Fitr",
            nameAr: "عيد الفطر",
            date: ["2025-03-30", "2025-04-03"],
            type: "holiday",
            tentative: true,
          },
          {
            nameEn: "Last Day of Classes",
            nameAr: "آخر يوم دراسي",
            date: "2025-04-15",
            type: "academic",
          },
          {
            nameEn: "Final Exam Days",
            nameAr: "الاختبارات النهائية",
            date: ["2025-04-18", "2025-04-26"],
            type: "exam",
          },
          {
            nameEn: "End of Term",
            nameAr: "نهاية الفصل الدراسي",
            date: "2025-04-27",
            type: "academic",
          },
          {
            nameEn: "Grades Released to Students",
            nameAr: "إصدار الدرجات للطلاب",
            date: "2025-05-01",
            type: "academic",
            tentative: true,
          },
        ],
      },
      {
        id: "spring-2025",
        nameEn: "Spring Semester 2025",
        nameAr: "فصل الربيع الدراسي 2025",
        events: [
          {
            nameEn: "Registration Opens",
            nameAr: "فتح باب التسجيل",
            date: "2025-03-16",
            type: "registration",
          },
          {
            nameEn: "Last Day to Register",
            nameAr: "آخر يوم للتسجيل",
            date: "2025-04-15",
            type: "deadline",
          },
          {
            nameEn: "Start of Spring Term / Faculty Return Date",
            nameAr: "بداية الفصل الدراسي/عودة الهيئة التعليمية",
            date: "2025-04-30",
            type: "academic",
          },
          {
            nameEn: "Start of Add / Drop Period",
            nameAr: "بداية فترة الحذف والإضافة",
            date: "2025-05-01",
            type: "registration",
          },
          {
            nameEn: "First Day of Classes",
            nameAr: "أول يوم دراسي",
            date: "2025-05-04",
            type: "academic",
          },
          {
            nameEn: "Appeal Application Submission Deadline",
            nameAr: "الموعد النهائي لتقديم طلب الاستئناف",
            date: "2025-05-04",
            type: "deadline",
          },
          {
            nameEn: "Appeal Hearings",
            nameAr: "جلسات الاستئناف",
            date: ["2025-05-05", "2025-05-06"],
            type: "academic",
          },
          {
            nameEn: "End of Add / Drop Period",
            nameAr: "نهاية فترة الحذف والإضافة",
            date: "2025-05-08",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Withdraw with Full Fees Refund",
            nameAr: "آخر يوم للانسحاب مع استرداد كامل للرسوم",
            date: "2025-05-08",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Withdraw with Prorated Fees Refund",
            nameAr: "آخر يوم للانسحاب مع استرداد جزئي للرسوم",
            date: "2025-05-22",
            type: "deadline",
          },
          {
            nameEn: "Last Day to Drop a Course / Withdraw from Semester",
            nameAr: "آخر يوم لحذف المواد/الانسحاب من الفصل الدراسي",
            date: "2025-05-22",
            type: "deadline",
          },
          {
            nameEn: "Eid Al-Adha",
            nameAr: "عيد الأضحى",
            date: ["2025-06-08", "2025-06-12"],
            type: "holiday",
            tentative: true,
          },
          {
            nameEn: "Last Day of Classes",
            nameAr: "آخر يوم دراسي",
            date: "2025-06-26",
            type: "academic",
          },
          {
            nameEn: "Final Exam Days",
            nameAr: "الاختبارات النهائية",
            date: ["2025-06-27", "2025-07-02"],
            type: "exam",
          },
          {
            nameEn: "End of Term",
            nameAr: "نهاية الفصل الدراسي",
            date: "2025-07-03",
            type: "academic",
          },
          {
            nameEn: "Grades Released to Students",
            nameAr: "إصدار الدرجات للطلاب",
            date: "2025-07-10",
            type: "academic",
            tentative: true,
          },
        ],
      },
    ],
  },
];
