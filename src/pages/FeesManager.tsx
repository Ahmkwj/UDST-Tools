import { useState, useEffect } from "react";
import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Footer from "../components/ui/Footer";

/* Theme: match Attendance / GPA / Grade Calculator / Calendar */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:py-2.5 [&_select]:py-2.5";
const sectionGap = "space-y-12";

// Fee structure interfaces
interface Course {
  id: string;
  name: string;
  credits: number;
  isRepeated: boolean;
}

interface FeeBreakdown {
  tuitionFees: number;
  materialsSupplies: number;
  studentServices: number;
  workTermFees: number;
  additionalFees: number;
  total: number;
}

// Student status types
type StudentStatus = 
  | "qatari_self" 
  | "qatari_sponsored" 
  | "qatari_mother_child" 
  | "udst_employee_child" 
  | "qatar_resident" 
  | "international";

// Fee rates for different programs
const feeRates = {
  foundation: {
    afterFall2020: {
      fullTime: { qatarResident: 12500, international: 18750 },
      partTime: { qatarResident: 2500, international: 2500 }
    },
    beforeFall2020: {
      nonSponsored: { fullTime: 10000, partTime: 2000 },
      sponsored: { fullTime: 15000, partTime: 3000 }
    }
  },
  tcp: {
    afterFall2020: { fullTime: 12500, partTime: 2500 },
    beforeFall2020: { fullTime: 15000, partTime: 3000 }
  },
  bachelor: {
    business: { qatarResident: 975, international: 1463 },
    computing: { qatarResident: 975, international: 1463 },
    engineering: { qatarResident: 980, international: 1470 },
    generalEducation: { qatarResident: 975, international: 1463 },
    healthSciences: { qatarResident: 985, international: 1478 }
  },
  graduate: {
    business: { qatarResident: 2165, international: 2194 },
    computing: { qatarResident: 2165, international: 2194 },
    engineering: { qatarResident: 2176, international: 2205 },
    generalEducation: { qatarResident: 2165, international: 2194 },
    healthSciences: { qatarResident: 2187, international: 2216 }
  },
  postgraduate: {
    neonatalCare: { qatarResident: 2187, international: 2216 },
    stemEducation: { qatarResident: 2165, international: 2194 }
  }
};

export default function FeesManager() {
  const locale = useLocale();

  // Form state
  const [step, setStep] = useState(1);
  const [programType, setProgramType] = useState("");
  const [major, setMajor] = useState("");
  const [enrollmentType, setEnrollmentType] = useState("fullTime");
  const [admissionDate, setAdmissionDate] = useState("afterFall2020");
  const [sponsorshipType, setSponsorshipType] = useState("nonSponsored");
  const [studentStatus, setStudentStatus] = useState<StudentStatus>("qatar_resident");
  const [courses, setCourses] = useState<Course[]>([]);
  const [numCourses, setNumCourses] = useState(1);
  
  // Additional fees (simplified)
  const [includeAdditionalFees, setIncludeAdditionalFees] = useState(false);
  const [additionalFeesAmount, setAdditionalFeesAmount] = useState(0);

  // Fee breakdown state
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown>({
    tuitionFees: 0,
    materialsSupplies: 0,
    studentServices: 0,
    workTermFees: 0,
    additionalFees: 0,
    total: 0
  });

  const translations = {
    title: {
      en: "Fees Manager",
      ar: "إدارة الرسوم"
    },
    description: {
      en: "Estimate semester fees by program, courses, and student status.",
      ar: "قدّر رسوم الفصل حسب البرنامج والمقررات وحالة الطالب."
    },
    step1Title: {
      en: "Program Information",
      ar: "معلومات البرنامج"
    },
    step2Title: {
      en: "Courses & Credit Hours",
      ar: "المقررات والساعات المعتمدة"
    },
    step3Title: {
      en: "Fee Calculation",
      ar: "حساب الرسوم"
    },
    programType: {
      en: "Program Type",
      ar: "نوع البرنامج"
    },
    major: {
      en: "Major/Field of Study",
      ar: "التخصص/مجال الدراسة"
    },
    enrollmentType: {
      en: "Enrollment Type",
      ar: "نوع التسجيل"
    },
    studentStatus: {
      en: "Student Status",
      ar: "حالة الطالب"
    },
    // Student status options
    qatariSelf: {
      en: "Qatari Student (Self-sponsored)",
      ar: "طالب قطري (ممول ذاتيّا)"
    },
    qatariSponsored: {
      en: "Qatari Student (Third-party sponsored)",
      ar: "طالب قطري (ممول من جهة خارجيّة)"
    },
    qatariMotherChild: {
      en: "Child of Qatari Mother",
      ar: "ابن/ابنة أم قطرية"
    },
    udstEmployeeChild: {
      en: "Child of UDST Employee",
      ar: "ابن/ابنة موظف في جامعة الدوحة للعلوم والتكنولوجيا"
    },
    qatarResident: {
      en: "Qatar Resident",
      ar: "مقيم في قطر"
    },
    international: {
      en: "International Student",
      ar: "طالب دولي"
    },
    // Status descriptions
    qatariSelfDesc: {
      en: "100% tuition waiver for Undergraduate & Foundation programs",
      ar: "إعفاء كامل 100% من الرسوم الدراسية لبرامج البكالوريوس والتأسيسي"
    },
    qatariSponsoredDesc: {
      en: "100% tuition waiver for Undergraduate & Foundation programs",
      ar: "إعفاء كامل 100% من الرسوم الدراسية لبرامج البكالوريوس والتأسيسي"
    },
    qatariMotherChildDesc: {
      en: "100% tuition waiver for Undergraduate & Foundation programs",
      ar: "إعفاء كامل 100% من الرسوم الدراسية لبرامج البكالوريوس والتأسيسي"
    },
    udstEmployeeChildDesc: {
      en: "50% tuition waiver for Undergraduate & Foundation programs",
      ar: "إعفاء 50% من الرسوم الدراسية لبرامج البكالوريوس والتأسيسي"
    },
    qatarResidentDesc: {
      en: "Qatar resident tuition rates apply",
      ar: "تطبق رسوم المقيمين في قطر"
    },
    internationalDesc: {
      en: "International student tuition rates apply",
      ar: "تطبق رسوم الطلاب الدوليين"
    },
    numCourses: {
      en: "Number of Courses",
      ar: "عدد المقررات"
    },
    courseName: {
      en: "Course Name",
      ar: "اسم المقرر"
    },
    creditHours: {
      en: "Credit Hours",
      ar: "الساعات المعتمدة"
    },
    repeatedCourse: {
      en: "Repeated Course",
      ar: "مقرر معاد"
    },
    nextStep: {
      en: "Next Step",
      ar: "الخطوة التالية"
    },
    previousStep: {
      en: "Previous Step",
      ar: "الخطوة السابقة"
    },
    calculateFees: {
      en: "Calculate Fees",
      ar: "احسب الرسوم"
    },
    totalSemesterFees: {
      en: "Total Semester Fees",
      ar: "إجمالي رسوم الفصل الدراسي"
    },
    tuitionFees: {
      en: "Tuition Fees",
      ar: "الرسوم الدراسية"
    },
    materialsSupplies: {
      en: "Materials & Supplies",
      ar: "المواد والإمدادات"
    },
    studentServices: {
      en: "Student Services",
      ar: "الخدمات الطلابية"
    },
    additionalFees: {
      en: "Additional Fees",
      ar: "رسوم إضافية"
    },
    qar: {
      en: "QAR",
      ar: "ريال قطري"
    },
    free: {
      en: "FREE",
      ar: "مجاني"
    },
    tuitionExempt: {
      en: "Tuition Exempt",
      ar: "معفى من الرسوم الدراسية"
    }
  };

  // Helper function to check if student has tuition exemption
  const hasTuitionExemption = () => {
    const exemptStatuses: StudentStatus[] = ["qatari_self", "qatari_sponsored", "qatari_mother_child", "udst_employee_child"];
    const exemptPrograms = ["foundation", "diploma", "bachelor", "postDiploma", "preMaster"];
    
    return exemptStatuses.includes(studentStatus) && exemptPrograms.includes(programType);
  };

  // Helper function to check if student has full exemption (no fees at all except repeated courses)
  const hasFullExemption = () => {
    const fullExemptStatuses: StudentStatus[] = ["qatari_self", "qatari_sponsored", "qatari_mother_child"];
    const exemptPrograms = ["foundation", "diploma", "bachelor", "postDiploma", "preMaster"];
    
    return fullExemptStatuses.includes(studentStatus) && exemptPrograms.includes(programType);
  };

  // Helper function to check if repeated course option should be shown
  const shouldShowRepeatedOption = () => {
    return hasTuitionExemption();
  };

  // Initialize courses when number changes
  useEffect(() => {
    const newCourses: Course[] = Array.from({ length: numCourses }, (_, index) => {
      // Keep existing course data if available
      const existingCourse = courses[index];
      return existingCourse || {
        id: `course-${index}`,
        name: locale === "ar" 
          ? index === 0 ? "المقرر الأول"
          : index === 1 ? "المقرر الثاني"
          : index === 2 ? "المقرر الثالث"
          : index === 3 ? "المقرر الرابع"
          : index === 4 ? "المقرر الخامس"
          : index === 5 ? "المقرر السادس"
          : index === 6 ? "المقرر السابع"
          : "المقرر الثامن"
          : `Course ${index + 1}`,
        credits: 3,
        isRepeated: false
      };
    });
    setCourses(newCourses);
  }, [numCourses]);

  // Dynamic updates when student status changes
  useEffect(() => {
    // Reset repeated course flags when student status changes
    if (!shouldShowRepeatedOption()) {
      setCourses(prevCourses => 
        prevCourses.map(course => ({ ...course, isRepeated: false }))
      );
    }
  }, [studentStatus]);

  // Dynamic updates when program type changes
  useEffect(() => {
    // Reset major when program type changes
    setMajor("");
    // Reset repeated course flags if exemption no longer applies
    if (!shouldShowRepeatedOption()) {
      setCourses(prevCourses => 
        prevCourses.map(course => ({ ...course, isRepeated: false }))
      );
    }
  }, [programType]);

  // Auto-calculate fees when inputs change
  useEffect(() => {
    if (step === 3) {
      calculateFees();
    }
  }, [step, programType, major, enrollmentType, studentStatus, courses, additionalFeesAmount]);

  const calculateFees = () => {
    let tuitionFees = 0;
    let materialsSupplies = 0;
    let studentServices = 150; // Standard student services fee

    // Check if student has full exemption (Qatari students in undergraduate/foundation programs)
    const isFullyExempt = hasFullExemption();
    const hasTuitionWaiver = hasTuitionExemption();
    const isPartialExempt = studentStatus === "udst_employee_child" && hasTuitionWaiver;

    // If fully exempt, no fees except for repeated courses
    if (isFullyExempt) {
      studentServices = 0; // No student services fee for fully exempt students
      materialsSupplies = 0; // No materials fee for fully exempt students
      
      // Only charge for repeated courses
      const repeatedCourses = courses.filter(course => course.isRepeated);
      if (repeatedCourses.length > 0) {
        tuitionFees = calculateRepeatedCourseFees(repeatedCourses);
      }
    } else {
      // Calculate regular fees
      tuitionFees = calculateRegularTuitionFees();
      materialsSupplies = calculateMaterialsFees();
      
      // Apply partial exemption for UDST employee children
      if (isPartialExempt) {
        tuitionFees = tuitionFees * 0.5; // 50% discount
      }
      
      // Add repeated course fees for exempt students
      if (hasTuitionWaiver) {
        const repeatedCourses = courses.filter(course => course.isRepeated);
        if (repeatedCourses.length > 0) {
          tuitionFees += calculateRepeatedCourseFees(repeatedCourses);
        }
      }
    }

    const total = tuitionFees + materialsSupplies + studentServices + additionalFeesAmount;

    setFeeBreakdown({
      tuitionFees,
      materialsSupplies,
      studentServices,
      workTermFees: 0,
      additionalFees: additionalFeesAmount,
      total
    });
  };

  const calculateRegularTuitionFees = (): number => {
    let tuitionFees = 0;
    const isInternational = studentStatus === "international";

    if (programType === "foundation" || programType === "diploma") {
      const structure = feeRates.foundation[admissionDate as keyof typeof feeRates.foundation];
      
      if (admissionDate === "afterFall2020") {
        const rates = structure[enrollmentType as keyof typeof structure] as any;
        if (enrollmentType === "fullTime") {
          tuitionFees = isInternational ? rates.international : rates.qatarResident;
        } else {
          tuitionFees = courses.length * rates.qatarResident;
        }
      } else {
        const rates = structure[sponsorshipType as keyof typeof structure] as any;
        if (enrollmentType === "fullTime") {
          tuitionFees = rates.fullTime;
        } else {
          tuitionFees = courses.length * rates.partTime;
        }
      }
    } else if (programType === "tcp") {
      const rates = feeRates.tcp[admissionDate as keyof typeof feeRates.tcp];
      if (enrollmentType === "fullTime") {
        tuitionFees = rates.fullTime;
      } else {
        tuitionFees = courses.length * rates.partTime;
      }
    } else if (programType === "bachelor" || programType === "postDiploma" || programType === "preMaster") {
      const majorRates = feeRates.bachelor[major as keyof typeof feeRates.bachelor];
      if (majorRates) {
        const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
        const creditRate = isInternational ? majorRates.international : majorRates.qatarResident;
        tuitionFees = totalCredits * creditRate;
      }
    } else if (programType === "graduate") {
      const majorRates = feeRates.graduate[major as keyof typeof feeRates.graduate];
      if (majorRates) {
        const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
        const creditRate = isInternational ? majorRates.international : majorRates.qatarResident;
        tuitionFees = totalCredits * creditRate;
      }
    } else if (programType === "postgraduate") {
      const programRates = feeRates.postgraduate[major as keyof typeof feeRates.postgraduate];
      if (programRates) {
        const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
        const creditRate = isInternational ? programRates.international : programRates.qatarResident;
        tuitionFees = totalCredits * creditRate;
      }
    }

    return tuitionFees;
  };

  const calculateRepeatedCourseFees = (repeatedCourses: Course[]): number => {
    let fees = 0;
    const isInternational = studentStatus === "international";

    if (programType === "foundation" || programType === "diploma") {
      const structure = feeRates.foundation[admissionDate as keyof typeof feeRates.foundation];
      if (admissionDate === "afterFall2020") {
        const rates = (structure as any).partTime;
        fees = repeatedCourses.length * rates.qatarResident;
      } else {
        const rates = structure[sponsorshipType as keyof typeof structure] as any;
        fees = repeatedCourses.length * rates.partTime;
      }
    } else if (programType === "tcp") {
      const rates = feeRates.tcp[admissionDate as keyof typeof feeRates.tcp];
      fees = repeatedCourses.length * rates.partTime;
    } else if (programType === "bachelor" || programType === "postDiploma" || programType === "preMaster") {
      const majorRates = feeRates.bachelor[major as keyof typeof feeRates.bachelor];
      if (majorRates) {
        const repeatedCredits = repeatedCourses.reduce((sum, course) => sum + course.credits, 0);
        const creditRate = isInternational ? majorRates.international : majorRates.qatarResident;
        fees = repeatedCredits * creditRate;
      }
    } else if (programType === "graduate") {
      const majorRates = feeRates.graduate[major as keyof typeof feeRates.graduate];
      if (majorRates) {
        const repeatedCredits = repeatedCourses.reduce((sum, course) => sum + course.credits, 0);
        const creditRate = isInternational ? majorRates.international : majorRates.qatarResident;
        fees = repeatedCredits * creditRate;
      }
    }

    return fees;
  };

  const calculateMaterialsFees = (): number => {
    if (programType === "foundation" || programType === "diploma" || programType === "tcp") {
      return enrollmentType === "fullTime" ? 150 : courses.length * 25;
    }
    return 150; // Standard for bachelor and above
  };

  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const canProceedToStep2 = () => {
    return programType && (
      !["bachelor", "graduate", "postDiploma", "preMaster", "postgraduate"].includes(programType) || 
      major
    );
  };

  const canProceedToStep3 = () => {
    return courses.length > 0 && courses.every(course => course.credits > 0);
  };

  const getStudentStatusOptions = () => [
    {
      value: "qatari_self" as StudentStatus,
      label: translations.qatariSelf[locale],
      description: translations.qatariSelfDesc[locale],
      color: "blue" as const
    },
    {
      value: "qatari_sponsored" as StudentStatus,
      label: translations.qatariSponsored[locale],
      description: translations.qatariSponsoredDesc[locale],
      color: "blue" as const
    },
    {
      value: "qatari_mother_child" as StudentStatus,
      label: translations.qatariMotherChild[locale],
      description: translations.qatariMotherChildDesc[locale],
      color: "blue" as const
    },
    {
      value: "udst_employee_child" as StudentStatus,
      label: translations.udstEmployeeChild[locale],
      description: translations.udstEmployeeChildDesc[locale],
      color: "purple" as const
    },
    {
      value: "qatar_resident" as StudentStatus,
      label: translations.qatarResident[locale],
      description: translations.qatarResidentDesc[locale],
      color: "green" as const
    },
    {
      value: "international" as StudentStatus,
      label: translations.international[locale],
      description: translations.internationalDesc[locale],
      color: "orange" as const
    }
  ];

  return (
    <div className="page-container">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={translations.title}
            description={translations.description}
          />

          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNum, index) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      step >= stepNum ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "bg-zinc-800/50 text-zinc-500 border border-zinc-600/40"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-1.5 ${step > stepNum ? "bg-blue-500/50" : "bg-zinc-600/40"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className={sectionGap}>
              <Card title={translations.step1Title[locale]} className={cardClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Select
                    label={translations.programType[locale]}
                    value={programType}
                    onChange={(e) => {
                      setProgramType(e.target.value);
                      setMajor("");
                    }}
                    className={inputSelectClass}
                  >
                      <option value="">{locale === "en" ? "Select Program Type" : "اختر نوع البرنامج"}</option>
                      <option value="foundation">{locale === "en" ? "Foundation Program" : "برنامج التأسيسي"}</option>
                      <option value="diploma">{locale === "en" ? "Diploma Program" : "برنامج الدبلوم"}</option>
                      <option value="tcp">{locale === "en" ? "Technician Certificate (TCP)" : "شهادة التقني"}</option>
                      <option value="bachelor">{locale === "en" ? "Bachelor's Degree" : "درجة البكالوريوس"}</option>
                      <option value="postDiploma">{locale === "en" ? "Post-Diploma" : "ما بعد الدبلوم"}</option>
                      <option value="preMaster">{locale === "en" ? "Pre-Master" : "ما قبل الماجستير"}</option>
                      <option value="graduate">{locale === "en" ? "Master's Degree" : "درجة الماجستير"}</option>
                      <option value="postgraduate">{locale === "en" ? "Postgraduate Diploma" : "دبلوم الدراسات العليا"}</option>
                    </Select>

                    {(programType === "bachelor" || programType === "graduate" || programType === "postDiploma" || programType === "preMaster") && (
                      <Select
                        label={translations.major[locale]}
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className={inputSelectClass}
                      >
                        <option value="">{locale === "en" ? "Select Major" : "اختر التخصص"}</option>
                        <option value="business">{locale === "en" ? "Business Management" : "إدارة الأعمال"}</option>
                        <option value="computing">{locale === "en" ? "Computing & IT" : "الحاسوب وتكنولوجيا المعلومات"}</option>
                        <option value="engineering">{locale === "en" ? "Engineering & Technology" : "الهندسة والتكنولوجيا"}</option>
                        <option value="generalEducation">{locale === "en" ? "General Education" : "التعليم العام"}</option>
                        <option value="healthSciences">{locale === "en" ? "Health Sciences" : "العلوم الصحية"}</option>
                      </Select>
                    )}

                    {programType === "postgraduate" && (
                      <Select
                        label={translations.major[locale]}
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className={inputSelectClass}
                      >
                        <option value="">{locale === "en" ? "Select Program" : "اختر البرنامج"}</option>
                        <option value="neonatalCare">{locale === "en" ? "Neonatal Intensive Care" : "العناية المركزة لحديثي الولادة"}</option>
                        <option value="stemEducation">{locale === "en" ? "STEM/TVET Education" : "تعليم العلوم والتكنولوجيا"}</option>
                      </Select>
                    )}

                    <Select
                      label={translations.enrollmentType[locale]}
                      value={enrollmentType}
                      onChange={(e) => setEnrollmentType(e.target.value)}
                      className={inputSelectClass}
                    >
                      <option value="fullTime">{locale === "en" ? "Full-time" : "دوام كامل"}</option>
                      <option value="partTime">{locale === "en" ? "Part-time" : "دوام جزئي"}</option>
                    </Select>

                    {(programType === "foundation" || programType === "diploma" || programType === "tcp") && (
                      <Select
                        label={locale === "en" ? "Admission Date" : "تاريخ القبول"}
                        value={admissionDate}
                        onChange={(e) => setAdmissionDate(e.target.value)}
                        className={inputSelectClass}
                      >
                        <option value="afterFall2020">{locale === "en" ? "Fall 2020 or later" : "خريف 2020 أو بعدها"}</option>
                        <option value="beforeFall2020">{locale === "en" ? "Before Fall 2020" : "قبل خريف 2020"}</option>
                      </Select>
                    )}

                    {(programType === "foundation" || programType === "diploma") && admissionDate === "beforeFall2020" && (
                      <Select
                        label={locale === "en" ? "Sponsorship Type" : "نوع الرعاية"}
                        value={sponsorshipType}
                        onChange={(e) => setSponsorshipType(e.target.value)}
                        className={inputSelectClass}
                      >
                        <option value="nonSponsored">{locale === "en" ? "Non-sponsored" : "غير مدعوم"}</option>
                        <option value="sponsored">{locale === "en" ? "Sponsored" : "مدعوم"}</option>
                      </Select>
                    )}
                </div>
              </Card>

              <Card title={translations.studentStatus[locale]} className={cardClass}>
                <div className="space-y-0">
                  {getStudentStatusOptions().map((option, idx) => {
                    const isSelected = studentStatus === option.value;
                    const dotClass = isSelected
                      ? option.color === "blue"
                        ? "border-blue-500 bg-blue-500/20"
                        : option.color === "purple"
                          ? "border-purple-500 bg-purple-500/20"
                          : option.color === "green"
                            ? "border-green-500 bg-green-500/20"
                            : "border-orange-500 bg-orange-500/20"
                      : "border-zinc-600 bg-transparent";
                    return (
                      <div
                        key={option.value}
                        className={`flex items-start gap-3 py-3 cursor-pointer transition-colors ${locale === "ar" ? "flex-row-reverse" : ""} ${
                          idx > 0 ? "border-t border-zinc-600/25" : ""
                        }`}
                        onClick={() => setStudentStatus(option.value)}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${dotClass}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{option.label}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{option.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-600/40">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2()}
                  >
                    {translations.nextStep[locale]}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card title={translations.step2Title[locale]} className={cardClass}>
                <div className="space-y-6">
                  <Select
                    label={translations.numCourses[locale]}
                    value={numCourses.toString()}
                    onChange={(e) => setNumCourses(parseInt(e.target.value))}
                    className={inputSelectClass}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num.toString()}>
                        {num} {locale === "en" ? (num === 1 ? "course" : "courses") : (num === 1 ? "مقرر" : "مقررات")}
                      </option>
                    ))}
                  </Select>

                  <div className="space-y-0">
                    {courses.map((course, index) => (
                      <div
                        key={course.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 py-4 ${index > 0 ? "border-t border-zinc-600/25" : ""}`}
                      >
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label={translations.courseName[locale]}
                            value={course.name}
                            onChange={(e) => updateCourse(index, "name", e.target.value)}
                            className={`${inputSelectClass} !mb-0`}
                          />
                          <Input
                            label={translations.creditHours[locale]}
                            type="number"
                            min="1"
                            max="6"
                            value={course.credits}
                            onChange={(e) => updateCourse(index, "credits", parseInt(e.target.value) || 3)}
                            className={`${inputSelectClass} !mb-0 [&_input]:py-2`}
                          />
                        </div>
                        {shouldShowRepeatedOption() && (
                          <Checkbox
                            label={translations.repeatedCourse[locale]}
                            checked={course.isRepeated}
                            onChange={(e) => updateCourse(index, "isRepeated", e.target.checked)}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-zinc-600/40">
                    <Checkbox
                      label={`${translations.additionalFees[locale]} (${locale === "en" ? "optional" : "اختياري"})`}
                      checked={includeAdditionalFees}
                      onChange={(e) => setIncludeAdditionalFees(e.target.checked)}
                    />
                    {includeAdditionalFees && (
                      <div className="mt-3">
                        <Input
                          label={`${translations.additionalFees[locale]} (QAR)`}
                          type="number"
                          min="0"
                          value={additionalFeesAmount}
                          onChange={(e) => setAdditionalFeesAmount(parseInt(e.target.value) || 0)}
                          helperText={locale === "en" ? "Housing, printing, etc." : "سكن، طباعة، إلخ"}
                          className={inputSelectClass}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card title={locale === "en" ? "Course Summary" : "ملخص المقررات"} className={cardClass}>
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-zinc-600/40">
                    <p className="text-3xl font-bold tabular-nums text-blue-400">
                      {courses.reduce((sum, course) => sum + course.credits, 0)}
                    </p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                      {locale === "en" ? "Total credits" : "إجمالي الساعات"}
                    </p>
                  </div>
                  <div className="space-y-0">
                    {courses.map((course, idx) => (
                      <div
                        key={course.id}
                        className={`flex justify-between items-center py-3 ${locale === "ar" ? "flex-row-reverse" : ""} ${
                          idx > 0 ? "border-t border-zinc-600/25" : ""
                        }`}
                      >
                        <span className="text-sm text-white truncate">{course.name}</span>
                        <span className="text-sm text-blue-400 tabular-nums">
                          {course.credits} {locale === "en" ? "h" : "س"}
                          {course.isRepeated && (
                            <span className="text-xs text-orange-400 ms-1">
                              {locale === "en" ? "(repeat)" : "(معاد)"}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  {hasFullExemption() && (
                    <p className="text-xs text-blue-400/90 pt-2 border-t border-zinc-600/25">
                      {locale === "en" ? "Tuition exempt. Only repeated courses are charged." : "معفى من الرسوم. تُحسب المقررات المعادة فقط."}
                    </p>
                  )}
                  <div className={`flex gap-3 pt-4 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      {translations.previousStep[locale]}
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3()}
                      className="flex-1"
                    >
                      {translations.calculateFees[locale]}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card title={translations.step3Title[locale]} className={cardClass}>
                <div className="text-center mb-6">
                  <p className="text-5xl sm:text-6xl font-bold tabular-nums text-blue-400">
                    {feeBreakdown.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">{translations.qar[locale]}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-2">{translations.totalSemesterFees[locale]}</p>
                </div>

                <div className="space-y-0 py-4 border-t border-zinc-600/40">
                  <div className={`flex justify-between py-2 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm text-zinc-400">{translations.tuitionFees[locale]}</span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {hasFullExemption() && feeBreakdown.tuitionFees === 0
                        ? translations.free[locale]
                        : `${feeBreakdown.tuitionFees.toLocaleString()} ${translations.qar[locale]}`
                      }
                    </span>
                  </div>
                  <div className={`flex justify-between py-2 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm text-zinc-400">{translations.materialsSupplies[locale]}</span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {hasFullExemption() && feeBreakdown.materialsSupplies === 0
                        ? translations.free[locale]
                        : `${feeBreakdown.materialsSupplies.toLocaleString()} ${translations.qar[locale]}`
                      }
                    </span>
                  </div>
                  <div className={`flex justify-between py-2 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm text-zinc-400">{translations.studentServices[locale]}</span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {hasFullExemption() && feeBreakdown.studentServices === 0
                        ? translations.free[locale]
                        : `${feeBreakdown.studentServices.toLocaleString()} ${translations.qar[locale]}`
                      }
                    </span>
                  </div>
                  {feeBreakdown.additionalFees > 0 && (
                    <div className={`flex justify-between py-2 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className="text-sm text-zinc-400">{translations.additionalFees[locale]}</span>
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {feeBreakdown.additionalFees.toLocaleString()} {translations.qar[locale]}
                      </span>
                    </div>
                  )}
                </div>

                {hasTuitionExemption() && (
                  <p className="text-xs text-blue-400/90 pt-3 border-t border-zinc-600/40">
                    {hasFullExemption()
                      ? (locale === "en" ? "Full exemption. You only pay for repeated courses." : "إعفاء كامل. تدفع فقط للمقررات المعادة.")
                      : (locale === "en"
                          ? `${studentStatus === "udst_employee_child" ? "50%" : "100%"} waiver. Repeated courses charged separately.`
                          : `إعفاء ${studentStatus === "udst_employee_child" ? "50%" : "100%"}، المقررات المعادة تُحسب منفصلة.`
                        )
                    }
                  </p>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(2)}
                  className="mt-6 rounded-xl border-zinc-500/40 text-zinc-300 hover:text-white hover:bg-zinc-700/40"
                >
                  {translations.previousStep[locale]}
                </Button>
              </Card>

              <Card title={locale === "en" ? "Program Summary" : "ملخص البرنامج"} className={cardClass}>
                <div className="space-y-0">
                  <div className={`flex justify-between py-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-zinc-500">{translations.programType[locale]}</span>
                    <span className="text-sm font-medium text-white capitalize">
                      {programType === "foundation" && (locale === "en" ? "Foundation" : "برنامج التأسيسي")}
                      {programType === "bachelor" && (locale === "en" ? "Bachelor" : "بكالوريوس")}
                      {programType === "graduate" && (locale === "en" ? "Master" : "ماجستير")}
                      {programType === "tcp" && (locale === "en" ? "TCP" : "شهادة التقني")}
                      {programType === "diploma" && (locale === "en" ? "Diploma" : "دبلوم")}
                      {programType === "postDiploma" && (locale === "en" ? "Post-Diploma" : "ما بعد الدبلوم")}
                      {programType === "preMaster" && (locale === "en" ? "Pre-Master" : "ما قبل الماجستير")}
                      {programType === "postgraduate" && (locale === "en" ? "Postgraduate Diploma" : "دبلوم الدراسات العليا")}
                    </span>
                  </div>
                  {major && (
                    <div className={`flex justify-between py-3 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-zinc-500">{translations.major[locale]}</span>
                      <span className="text-sm font-medium text-white capitalize">
                        {major === "business" && (locale === "en" ? "Business" : "إدارة الأعمال")}
                        {major === "computing" && (locale === "en" ? "Computing" : "الحاسوب وتكنولوجيا المعلومات")}
                        {major === "engineering" && (locale === "en" ? "Engineering" : "الهندسة والتكنولوجيا")}
                        {major === "generalEducation" && (locale === "en" ? "General Education" : "التعليم العام")}
                        {major === "healthSciences" && (locale === "en" ? "Health Sciences" : "العلوم الصحية")}
                        {major === "neonatalCare" && (locale === "en" ? "Neonatal Care" : "العناية المركزة لحديثي الولادة")}
                        {major === "stemEducation" && (locale === "en" ? "STEM Education" : "تعليم العلوم والتكنولوجيا")}
                      </span>
                    </div>
                  )}
                  <div className={`flex justify-between py-3 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-zinc-500">{translations.enrollmentType[locale]}</span>
                    <span className="text-sm font-medium text-white">
                      {enrollmentType === "fullTime" ? (locale === "en" ? "Full-time" : "دوام كامل") : (locale === "en" ? "Part-time" : "دوام جزئي")}
                    </span>
                  </div>
                  <div className={`flex justify-between py-3 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-zinc-500">{translations.studentStatus[locale]}</span>
                    <span className="text-sm font-medium text-white">{getStudentStatusOptions().find((o) => o.value === studentStatus)?.label}</span>
                  </div>
                  <div className={`flex justify-between py-3 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-zinc-500">{locale === "en" ? "Courses" : "المقررات"}</span>
                    <span className="text-sm font-medium text-white tabular-nums">{courses.length}</span>
                  </div>
                  <div className={`flex justify-between py-3 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-zinc-500">{locale === "en" ? "Credits" : "الساعات المعتمدة"}</span>
                    <span className="text-sm font-medium text-white tabular-nums">{courses.reduce((s, c) => s + c.credits, 0)}</span>
                  </div>
                  {shouldShowRepeatedOption() && courses.some((c) => c.isRepeated) && (
                    <div className={`flex justify-between py-3 border-t border-zinc-600/25 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-orange-400/90">{locale === "en" ? "Repeated" : "المقررات المعادة"}</span>
                      <span className="text-sm font-medium text-orange-400">{courses.filter((c) => c.isRepeated).length}</span>
                    </div>
                  )}
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