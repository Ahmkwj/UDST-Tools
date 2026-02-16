import { useState, useEffect } from "react";
import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";

interface Course { id: string; name: string; credits: number; isRepeated: boolean }
interface FeeBreakdown { tuitionFees: number; materialsSupplies: number; studentServices: number; workTermFees: number; additionalFees: number; total: number }

type StudentStatus = "qatari_self" | "qatari_sponsored" | "qatari_mother_child" | "udst_employee_child" | "qatar_resident" | "international";

const feeRates = {
  foundation: {
    afterFall2020: { fullTime: { qatarResident: 12500, international: 18750 }, partTime: { qatarResident: 2500, international: 2500 } },
    beforeFall2020: { nonSponsored: { fullTime: 10000, partTime: 2000 }, sponsored: { fullTime: 15000, partTime: 3000 } },
  },
  tcp: { afterFall2020: { fullTime: 12500, partTime: 2500 }, beforeFall2020: { fullTime: 15000, partTime: 3000 } },
  bachelor: {
    business: { qatarResident: 975, international: 1463 }, computing: { qatarResident: 975, international: 1463 },
    engineering: { qatarResident: 980, international: 1470 }, generalEducation: { qatarResident: 975, international: 1463 },
    healthSciences: { qatarResident: 985, international: 1478 },
  },
  graduate: {
    business: { qatarResident: 2165, international: 2194 }, computing: { qatarResident: 2165, international: 2194 },
    engineering: { qatarResident: 2176, international: 2205 }, generalEducation: { qatarResident: 2165, international: 2194 },
    healthSciences: { qatarResident: 2187, international: 2216 },
  },
  postgraduate: { neonatalCare: { qatarResident: 2187, international: 2216 }, stemEducation: { qatarResident: 2165, international: 2194 } },
};

const T = {
  title:            { en: "Fees Manager",             ar: "إدارة الرسوم" },
  desc:             { en: "Estimate semester fees by program, courses, and student status.", ar: "قدّر رسوم الفصل حسب البرنامج والمقررات وحالة الطالب." },
  step1:            { en: "Program & Status",          ar: "البرنامج والحالة" },
  step2:            { en: "Courses",                   ar: "المقررات" },
  step3:            { en: "Fees",                      ar: "الرسوم" },
  programType:      { en: "Program Type",              ar: "نوع البرنامج" },
  major:            { en: "Major / Field",             ar: "التخصص" },
  enrollment:       { en: "Enrollment",                ar: "نوع التسجيل" },
  status:           { en: "Student Status",            ar: "حالة الطالب" },
  numCourses:       { en: "Number of Courses",         ar: "عدد المقررات" },
  courseName:       { en: "Course",                    ar: "المقرر" },
  credits:          { en: "Credits",                   ar: "الساعات" },
  repeated:         { en: "Repeated",                  ar: "معاد" },
  next:             { en: "Next",                      ar: "التالي" },
  prev:             { en: "Back",                      ar: "السابق" },
  calculate:        { en: "Calculate",                 ar: "احسب" },
  total:            { en: "Total Semester Fees",       ar: "إجمالي رسوم الفصل" },
  tuition:          { en: "Tuition Fees",              ar: "الرسوم الدراسية" },
  materials:        { en: "Materials & Supplies",      ar: "المواد والإمدادات" },
  services:         { en: "Student Services",          ar: "الخدمات الطلابية" },
  additional:       { en: "Additional Fees",           ar: "رسوم إضافية" },
  qar:              { en: "QAR",                       ar: "ر.ق" },
  free:             { en: "FREE",                      ar: "مجاني" },
} as const;

const STATUS_OPTIONS: { value: StudentStatus; en: string; ar: string; descEn: string; descAr: string }[] = [
  { value: "qatari_self",          en: "Qatari (Self-sponsored)",   ar: "قطري (ممول ذاتيًا)",           descEn: "100% tuition waiver (UG & Foundation)", descAr: "إعفاء كامل من الرسوم (بكالوريوس والتأسيسي)" },
  { value: "qatari_sponsored",     en: "Qatari (Sponsored)",        ar: "قطري (ممول من جهة خارجية)",   descEn: "100% tuition waiver (UG & Foundation)", descAr: "إعفاء كامل من الرسوم (بكالوريوس والتأسيسي)" },
  { value: "qatari_mother_child",  en: "Child of Qatari Mother",    ar: "ابن/ابنة أم قطرية",           descEn: "100% tuition waiver (UG & Foundation)", descAr: "إعفاء كامل من الرسوم (بكالوريوس والتأسيسي)" },
  { value: "udst_employee_child",  en: "Child of UDST Employee",    ar: "ابن/ابنة موظف UDST",          descEn: "50% tuition waiver (UG & Foundation)",  descAr: "إعفاء 50% من الرسوم (بكالوريوس والتأسيسي)" },
  { value: "qatar_resident",       en: "Qatar Resident",            ar: "مقيم في قطر",                 descEn: "Resident tuition rates",                descAr: "رسوم المقيمين" },
  { value: "international",        en: "International",             ar: "طالب دولي",                   descEn: "International tuition rates",           descAr: "رسوم الطلاب الدوليين" },
];

export default function FeesManager() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = (key: keyof typeof T) => T[key][locale];

  const [step, setStep] = useLocalStorage<number>("fees-step", 1);
  const [programType, setProgramType] = useLocalStorage("fees-programType", "");
  const [major, setMajor] = useLocalStorage("fees-major", "");
  const [enrollmentType, setEnrollmentType] = useLocalStorage("fees-enrollmentType", "fullTime");
  const [admissionDate, setAdmissionDate] = useLocalStorage("fees-admissionDate", "afterFall2020");
  const [sponsorshipType, setSponsorshipType] = useLocalStorage("fees-sponsorshipType", "nonSponsored");
  const [studentStatus, setStudentStatus] = useLocalStorage<StudentStatus>("fees-studentStatus", "qatar_resident");
  const [courses, setCourses] = useLocalStorage("fees-courses", [] as Course[]);
  const [numCourses, setNumCourses] = useLocalStorage<number>("fees-numCourses", 1);
  const [includeAdditional, setIncludeAdditional] = useLocalStorage("fees-includeAdditionalFees", false);
  const [additionalAmt, setAdditionalAmt] = useLocalStorage("fees-additionalFeesAmount", 0);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown>({ tuitionFees: 0, materialsSupplies: 0, studentServices: 0, workTermFees: 0, additionalFees: 0, total: 0 });

  const exemptPrograms = ["foundation", "diploma", "bachelor", "postDiploma", "preMaster"];
  const fullExemptStatuses: StudentStatus[] = ["qatari_self", "qatari_sponsored", "qatari_mother_child"];
  const hasTuitionExemption = () => [...fullExemptStatuses, "udst_employee_child" as StudentStatus].includes(studentStatus) && exemptPrograms.includes(programType);
  const hasFullExemption = () => fullExemptStatuses.includes(studentStatus) && exemptPrograms.includes(programType);
  const showRepeated = () => hasTuitionExemption();
  const needsMajor = ["bachelor", "graduate", "postDiploma", "preMaster", "postgraduate"].includes(programType);
  const canStep2 = programType && (!needsMajor || major);
  const canStep3 = courses.length > 0 && courses.every((c) => c.credits > 0);

  useEffect(() => {
    const names = isRTL ? ["المقرر الأول", "المقرر الثاني", "المقرر الثالث", "المقرر الرابع", "المقرر الخامس", "المقرر السادس", "المقرر السابع", "المقرر الثامن"] : [];
    setCourses((prev) => {
      const out: Course[] = [];
      for (let i = 0; i < numCourses; i++) {
        out.push(prev[i] || { id: `course-${i}`, name: isRTL ? names[i] || `المقرر ${i + 1}` : `Course ${i + 1}`, credits: 3, isRepeated: false });
      }
      return out;
    });
  }, [numCourses]);

  useEffect(() => { if (!showRepeated()) setCourses((p) => p.map((c) => ({ ...c, isRepeated: false }))); }, [studentStatus]);
  useEffect(() => { setMajor(""); if (!showRepeated()) setCourses((p) => p.map((c) => ({ ...c, isRepeated: false }))); }, [programType]);

  useEffect(() => {
    if (step !== 3) return;
    let tuition = 0;
    let materials = 0;
    let services = 150;
    const isIntl = studentStatus === "international";
    const isFullExempt = hasFullExemption();
    const isPartialExempt = studentStatus === "udst_employee_child" && hasTuitionExemption();

    if (isFullExempt) {
      services = 0; materials = 0;
      const rep = courses.filter((c) => c.isRepeated);
      if (rep.length > 0) tuition = calcRepeatedFees(rep);
    } else {
      tuition = calcTuition(isIntl);
      materials = calcMaterials();
      if (isPartialExempt) tuition *= 0.5;
      if (hasTuitionExemption()) {
        const rep = courses.filter((c) => c.isRepeated);
        if (rep.length > 0) tuition += calcRepeatedFees(rep);
      }
    }
    const total = tuition + materials + services + additionalAmt;
    setFeeBreakdown({ tuitionFees: tuition, materialsSupplies: materials, studentServices: services, workTermFees: 0, additionalFees: additionalAmt, total });
  }, [step, programType, major, enrollmentType, studentStatus, courses, additionalAmt]);

  function calcTuition(isIntl: boolean) {
    if (programType === "foundation" || programType === "diploma") {
      const s = feeRates.foundation[admissionDate as keyof typeof feeRates.foundation] as any;
      if (admissionDate === "afterFall2020") {
        const r = s[enrollmentType]; return enrollmentType === "fullTime" ? (isIntl ? r.international : r.qatarResident) : courses.length * r.qatarResident;
      }
      const r = s[sponsorshipType]; return enrollmentType === "fullTime" ? r.fullTime : courses.length * r.partTime;
    }
    if (programType === "tcp") { const r = feeRates.tcp[admissionDate as keyof typeof feeRates.tcp]; return enrollmentType === "fullTime" ? r.fullTime : courses.length * r.partTime; }
    if (["bachelor", "postDiploma", "preMaster"].includes(programType)) {
      const mr = feeRates.bachelor[major as keyof typeof feeRates.bachelor]; if (!mr) return 0;
      return courses.reduce((s, c) => s + c.credits, 0) * (isIntl ? mr.international : mr.qatarResident);
    }
    if (programType === "graduate") {
      const mr = feeRates.graduate[major as keyof typeof feeRates.graduate]; if (!mr) return 0;
      return courses.reduce((s, c) => s + c.credits, 0) * (isIntl ? mr.international : mr.qatarResident);
    }
    if (programType === "postgraduate") {
      const mr = feeRates.postgraduate[major as keyof typeof feeRates.postgraduate]; if (!mr) return 0;
      return courses.reduce((s, c) => s + c.credits, 0) * (isIntl ? mr.international : mr.qatarResident);
    }
    return 0;
  }

  function calcRepeatedFees(rep: Course[]) {
    const isIntl = studentStatus === "international";
    if (programType === "foundation" || programType === "diploma") {
      const s = feeRates.foundation[admissionDate as keyof typeof feeRates.foundation] as any;
      if (admissionDate === "afterFall2020") return rep.length * s.partTime.qatarResident;
      return rep.length * s[sponsorshipType].partTime;
    }
    if (programType === "tcp") return rep.length * feeRates.tcp[admissionDate as keyof typeof feeRates.tcp].partTime;
    if (["bachelor", "postDiploma", "preMaster"].includes(programType)) {
      const mr = feeRates.bachelor[major as keyof typeof feeRates.bachelor]; if (!mr) return 0;
      return rep.reduce((s, c) => s + c.credits, 0) * (isIntl ? mr.international : mr.qatarResident);
    }
    if (programType === "graduate") {
      const mr = feeRates.graduate[major as keyof typeof feeRates.graduate]; if (!mr) return 0;
      return rep.reduce((s, c) => s + c.credits, 0) * (isIntl ? mr.international : mr.qatarResident);
    }
    return 0;
  }

  function calcMaterials() {
    if (["foundation", "diploma", "tcp"].includes(programType)) return enrollmentType === "fullTime" ? 150 : courses.length * 25;
    return 150;
  }

  const updateCourse = (i: number, f: keyof Course, v: unknown) => {
    setCourses((prev) => { const n = [...prev]; n[i] = { ...n[i], [f]: v }; return n; });
  };

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  /* ── Step indicator ── */
  const STEPS = [
    { n: 1, en: "Program", ar: "البرنامج" },
    { n: 2, en: "Courses", ar: "المقررات" },
    { n: 3, en: "Results", ar: "النتائج" },
  ];

  const selClass = "w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors";

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader title={T.title} description={T.desc} />

          {/* ════════ STEP INDICATOR ════════ */}
          <div className="flex items-center justify-center mb-8 sm:mb-10">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (s.n === 1) setStep(1);
                    else if (s.n === 2 && canStep2) setStep(2);
                    else if (s.n === 3 && canStep2 && canStep3) setStep(3);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    step === s.n
                      ? "bg-blue-500/10 border border-blue-500/25 text-blue-400"
                      : step > s.n
                        ? "bg-zinc-700/30 border border-zinc-600/30 text-zinc-300"
                        : "bg-zinc-800/30 border border-zinc-700/20 text-zinc-600"
                  }`}
                >
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    step === s.n ? "bg-blue-500 text-white" : step > s.n ? "bg-zinc-600 text-zinc-300" : "bg-zinc-700/50 text-zinc-600"
                  }`}>
                    {step > s.n ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                    ) : s.n}
                  </span>
                  <span className="hidden sm:inline">{isRTL ? s.ar : s.en}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 sm:w-10 h-px mx-1 ${step > s.n ? "bg-blue-500/30" : "bg-zinc-700/40"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ════════ STEP 1 ════════ */}
          {step === 1 && (
            <div className="space-y-6 sm:space-y-8">
              <Card title={t("step1")} className={cardClass}>
                <p className="text-xs text-zinc-500 mb-5">
                  {isRTL ? "اختر نوع البرنامج والتخصص ونوع التسجيل." : "Select your program, major, and enrollment type."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* program */}
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{t("programType")}</label>
                    <select value={programType} onChange={(e) => setProgramType(e.target.value)} className={selClass}>
                      <option value="">{isRTL ? "اختر" : "Select"}</option>
                      <option value="foundation">{isRTL ? "برنامج التأسيسي" : "Foundation"}</option>
                      <option value="diploma">{isRTL ? "دبلوم" : "Diploma"}</option>
                      <option value="tcp">{isRTL ? "شهادة التقني" : "TCP"}</option>
                      <option value="bachelor">{isRTL ? "بكالوريوس" : "Bachelor's"}</option>
                      <option value="postDiploma">{isRTL ? "ما بعد الدبلوم" : "Post-Diploma"}</option>
                      <option value="preMaster">{isRTL ? "ما قبل الماجستير" : "Pre-Master"}</option>
                      <option value="graduate">{isRTL ? "ماجستير" : "Master's"}</option>
                      <option value="postgraduate">{isRTL ? "دبلوم الدراسات العليا" : "Postgraduate Diploma"}</option>
                    </select>
                  </div>

                  {/* major */}
                  {(["bachelor", "graduate", "postDiploma", "preMaster"].includes(programType)) && (
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{t("major")}</label>
                      <select value={major} onChange={(e) => setMajor(e.target.value)} className={selClass}>
                        <option value="">{isRTL ? "اختر" : "Select"}</option>
                        <option value="business">{isRTL ? "إدارة الأعمال" : "Business"}</option>
                        <option value="computing">{isRTL ? "الحاسوب وتكنولوجيا المعلومات" : "Computing & IT"}</option>
                        <option value="engineering">{isRTL ? "الهندسة والتكنولوجيا" : "Engineering"}</option>
                        <option value="generalEducation">{isRTL ? "التعليم العام" : "General Education"}</option>
                        <option value="healthSciences">{isRTL ? "العلوم الصحية" : "Health Sciences"}</option>
                      </select>
                    </div>
                  )}
                  {programType === "postgraduate" && (
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{t("major")}</label>
                      <select value={major} onChange={(e) => setMajor(e.target.value)} className={selClass}>
                        <option value="">{isRTL ? "اختر" : "Select"}</option>
                        <option value="neonatalCare">{isRTL ? "العناية بحديثي الولادة" : "Neonatal Care"}</option>
                        <option value="stemEducation">{isRTL ? "تعليم العلوم والتكنولوجيا" : "STEM Education"}</option>
                      </select>
                    </div>
                  )}

                  {/* enrollment */}
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{t("enrollment")}</label>
                    <select value={enrollmentType} onChange={(e) => setEnrollmentType(e.target.value)} className={selClass}>
                      <option value="fullTime">{isRTL ? "دوام كامل" : "Full-time"}</option>
                      <option value="partTime">{isRTL ? "دوام جزئي" : "Part-time"}</option>
                    </select>
                  </div>

                  {/* admission date */}
                  {["foundation", "diploma", "tcp"].includes(programType) && (
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{isRTL ? "تاريخ القبول" : "Admission Date"}</label>
                      <select value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} className={selClass}>
                        <option value="afterFall2020">{isRTL ? "خريف 2020 أو بعدها" : "Fall 2020 or later"}</option>
                        <option value="beforeFall2020">{isRTL ? "قبل خريف 2020" : "Before Fall 2020"}</option>
                      </select>
                    </div>
                  )}

                  {/* sponsorship */}
                  {["foundation", "diploma"].includes(programType) && admissionDate === "beforeFall2020" && (
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{isRTL ? "نوع الرعاية" : "Sponsorship"}</label>
                      <select value={sponsorshipType} onChange={(e) => setSponsorshipType(e.target.value)} className={selClass}>
                        <option value="nonSponsored">{isRTL ? "غير مدعوم" : "Non-sponsored"}</option>
                        <option value="sponsored">{isRTL ? "مدعوم" : "Sponsored"}</option>
                      </select>
                    </div>
                  )}
                </div>
              </Card>

              {/* student status */}
              <Card title={t("status")} className={cardClass}>
                <p className="text-xs text-zinc-500 mb-4">
                  {isRTL ? "حالتك تحدد الرسوم والإعفاءات." : "Your status determines tuition rates and waivers."}
                </p>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((opt) => {
                    const sel = studentStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStudentStatus(opt.value)}
                        className={`w-full text-start flex items-start gap-3 rounded-xl px-4 py-3.5 border transition-colors ${
                          sel
                            ? "bg-blue-500/[0.06] border-blue-500/25"
                            : "bg-zinc-800/20 border-zinc-600/25 hover:border-zinc-500/30"
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          sel ? "border-blue-400" : "border-zinc-600"
                        }`}>
                          {sel && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${sel ? "text-white" : "text-zinc-300"}`}>
                            {isRTL ? opt.ar : opt.en}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {isRTL ? opt.descAr : opt.descEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={!canStep2}
                  onClick={() => setStep(2)}
                  className="w-full mt-6 px-5 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("next")}
                </button>
              </Card>
            </div>
          )}

          {/* ════════ STEP 2 ════════ */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              <Card title={t("step2")} className={`${cardClass} lg:col-span-3`}>
                <p className="text-xs text-zinc-500 mb-5">
                  {isRTL ? "أضف المقررات والساعات المعتمدة." : "Add your courses and credit hours."}
                </p>

                <div className="mb-5">
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">{t("numCourses")}</label>
                  <select value={numCourses} onChange={(e) => setNumCourses(parseInt(e.target.value))} className={`${selClass} w-full sm:w-48`}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} {isRTL ? (n === 1 ? "مقرر" : "مقررات") : (n === 1 ? "course" : "courses")}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {courses.map((c, i) => (
                    <div key={c.id} className="rounded-xl border border-zinc-600/25 bg-zinc-700/15 px-4 py-3.5 sm:px-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-600/30 text-zinc-400 text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <input
                          value={c.name}
                          onChange={(e) => updateCourse(i, "name", e.target.value)}
                          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-medium text-white placeholder-zinc-600"
                          placeholder={isRTL ? "اسم المقرر" : "Course name"}
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-zinc-500 shrink-0">{t("credits")}</label>
                          <input
                            type="number"
                            min="1"
                            max="6"
                            value={c.credits}
                            onChange={(e) => updateCourse(i, "credits", parseInt(e.target.value) || 3)}
                            className="w-16 bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-2.5 py-1.5 text-sm text-white text-center focus:outline-none focus:border-blue-500 transition-colors tabular-nums"
                          />
                        </div>
                        {showRepeated() && (
                          <button
                            type="button"
                            onClick={() => updateCourse(i, "isRepeated", !c.isRepeated)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              c.isRepeated
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                : "bg-zinc-800/40 border-zinc-600/30 text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.846a.75.75 0 0 0-.75.75v3.386a.75.75 0 0 0 1.5 0v-2.433l.311.311a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.388l-.858-.143ZM4.688 8.576a5.5 5.5 0 0 1 9.201-2.466l.312.311H11.77a.75.75 0 0 0 0 1.5h3.386a.75.75 0 0 0 .75-.75V3.786a.75.75 0 0 0-1.5 0v2.433l-.311-.311A7 7 0 0 0 2.383 9.045a.75.75 0 0 0 1.449.388l.856.143Z" clipRule="evenodd" />
                            </svg>
                            {t("repeated")}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* additional fees */}
                <div className="mt-5 pt-4 border-t border-zinc-700/30">
                  <button
                    type="button"
                    onClick={() => setIncludeAdditional(!includeAdditional)}
                    className={`flex items-center gap-2 text-xs font-medium transition-colors ${includeAdditional ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${includeAdditional ? "bg-blue-500 border-blue-500" : "border-zinc-600 bg-transparent"}`}>
                      {includeAdditional && <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>}
                    </div>
                    {t("additional")} ({isRTL ? "اختياري" : "optional"})
                  </button>
                  {includeAdditional && (
                    <div className="mt-3">
                      <input
                        type="number"
                        min="0"
                        value={additionalAmt}
                        onChange={(e) => setAdditionalAmt(parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className={`${selClass} w-full sm:w-48`}
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">{isRTL ? "سكن، طباعة، إلخ (بالريال)" : "Housing, printing, etc. (QAR)"}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* summary sidebar */}
              <Card className={`${cardClass} lg:col-span-2`}>
                <div className="text-center mb-5">
                  <p className="text-4xl font-bold text-blue-400 tabular-nums">{totalCredits}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{isRTL ? "إجمالي الساعات" : "Total Credits"}</p>
                </div>

                <div className="rounded-xl border border-zinc-600/25 bg-zinc-800/20 overflow-hidden mb-5">
                  {courses.map((c, i) => (
                    <div key={c.id} className={`flex items-center justify-between px-3.5 py-2.5 ${i > 0 ? "border-t border-zinc-700/25" : ""}`}>
                      <span className="text-xs text-white truncate min-w-0">{c.name}</span>
                      <span className="text-xs text-zinc-400 tabular-nums shrink-0 ms-2">
                        {c.credits}h
                        {c.isRepeated && <span className="text-amber-400 ms-1">*</span>}
                      </span>
                    </div>
                  ))}
                </div>

                {hasFullExemption() && (
                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] px-3 py-2.5 mb-5">
                    <p className="text-xs text-emerald-400">{isRTL ? "معفى من الرسوم. المقررات المعادة فقط تُحسب." : "Tuition exempt. Only repeated courses are charged."}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-600/40 text-zinc-400 text-sm font-medium hover:text-white hover:bg-zinc-700/30 transition-colors">
                    {t("prev")}
                  </button>
                  <button type="button" disabled={!canStep3} onClick={() => setStep(3)} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {t("calculate")}
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* ════════ STEP 3 ════════ */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* fees -- 3 cols */}
              <Card className={`${cardClass} lg:col-span-3`}>
                {/* big total */}
                <div className="text-center py-4 sm:py-6 mb-5 rounded-xl bg-zinc-700/15 border border-zinc-600/20">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-400 tabular-nums tracking-tight">
                    {feeBreakdown.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{t("qar")}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-2">{t("total")}</p>
                </div>

                {/* breakdown */}
                <div className="rounded-xl border border-zinc-600/25 bg-zinc-800/20 overflow-hidden">
                  {[
                    { label: t("tuition"), value: feeBreakdown.tuitionFees, freeCheck: hasFullExemption() && feeBreakdown.tuitionFees === 0 },
                    { label: t("materials"), value: feeBreakdown.materialsSupplies, freeCheck: hasFullExemption() && feeBreakdown.materialsSupplies === 0 },
                    { label: t("services"), value: feeBreakdown.studentServices, freeCheck: hasFullExemption() && feeBreakdown.studentServices === 0 },
                    ...(feeBreakdown.additionalFees > 0 ? [{ label: t("additional"), value: feeBreakdown.additionalFees, freeCheck: false }] : []),
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 sm:px-5 ${i > 0 ? "border-t border-zinc-700/25" : ""}`}>
                      <span className="text-xs sm:text-sm text-zinc-400">{row.label}</span>
                      <span className={`text-xs sm:text-sm font-semibold tabular-nums ${row.freeCheck ? "text-emerald-400" : "text-white"}`}>
                        {row.freeCheck ? t("free") : `${row.value.toLocaleString()} ${t("qar")}`}
                      </span>
                    </div>
                  ))}
                </div>

                {hasTuitionExemption() && (
                  <p className="text-xs text-zinc-400 mt-4 pt-3 border-t border-zinc-700/30">
                    {hasFullExemption()
                      ? isRTL ? "إعفاء كامل. تدفع فقط للمقررات المعادة." : "Full exemption. Only repeated courses are charged."
                      : isRTL
                        ? `إعفاء ${studentStatus === "udst_employee_child" ? "50%" : "100%"}. المقررات المعادة تُحسب منفصلة.`
                        : `${studentStatus === "udst_employee_child" ? "50%" : "100%"} waiver. Repeated courses charged separately.`
                    }
                  </p>
                )}

                <button type="button" onClick={() => setStep(2)} className="w-full mt-6 px-4 py-2.5 rounded-xl border border-zinc-600/40 text-zinc-400 text-sm font-medium hover:text-white hover:bg-zinc-700/30 transition-colors">
                  {t("prev")}
                </button>
              </Card>

              {/* program summary -- 2 cols */}
              <Card
                title={isRTL ? "ملخص البرنامج" : "Summary"}
                className={`${cardClass} lg:col-span-2`}
              >
                <div className="rounded-xl border border-zinc-600/25 bg-zinc-800/20 overflow-hidden">
                  {[
                    { label: t("programType"), value: programType === "foundation" ? (isRTL ? "تأسيسي" : "Foundation") : programType === "bachelor" ? (isRTL ? "بكالوريوس" : "Bachelor") : programType === "graduate" ? (isRTL ? "ماجستير" : "Master") : programType === "tcp" ? "TCP" : programType === "diploma" ? (isRTL ? "دبلوم" : "Diploma") : programType === "postDiploma" ? (isRTL ? "ما بعد الدبلوم" : "Post-Diploma") : programType === "preMaster" ? (isRTL ? "ما قبل الماجستير" : "Pre-Master") : (isRTL ? "دبلوم دراسات عليا" : "Postgraduate") },
                    ...(major ? [{ label: t("major"), value: major === "business" ? (isRTL ? "إدارة الأعمال" : "Business") : major === "computing" ? (isRTL ? "الحاسوب" : "Computing") : major === "engineering" ? (isRTL ? "الهندسة" : "Engineering") : major === "generalEducation" ? (isRTL ? "التعليم العام" : "General Ed") : major === "healthSciences" ? (isRTL ? "العلوم الصحية" : "Health Sci") : major === "neonatalCare" ? (isRTL ? "حديثي الولادة" : "Neonatal") : (isRTL ? "STEM" : "STEM Ed") }] : []),
                    { label: t("enrollment"), value: enrollmentType === "fullTime" ? (isRTL ? "دوام كامل" : "Full-time") : (isRTL ? "دوام جزئي" : "Part-time") },
                    { label: t("status"), value: STATUS_OPTIONS.find((o) => o.value === studentStatus)?.[isRTL ? "ar" : "en"] || "" },
                    { label: isRTL ? "المقررات" : "Courses", value: `${courses.length}` },
                    { label: isRTL ? "الساعات" : "Credits", value: `${totalCredits}` },
                    ...(showRepeated() && courses.some((c) => c.isRepeated) ? [{ label: isRTL ? "معادة" : "Repeated", value: `${courses.filter((c) => c.isRepeated).length}` }] : []),
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center justify-between px-3.5 py-2.5 ${i > 0 ? "border-t border-zinc-700/25" : ""}`}>
                      <span className="text-[11px] text-zinc-500">{row.label}</span>
                      <span className="text-xs font-medium text-white text-end truncate max-w-[55%]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
