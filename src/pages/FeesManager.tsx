import { useState, useEffect } from "react";
import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";

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
      en: "Calculate your semester fees based on your program, courses, and student status",
      ar: "احسب رسوم الفصل الدراسي بناءً على برنامجك ومقرراتك وحالة الطالب"
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
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={translations.title}
            description={translations.description}
          />

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((stepNum, index) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${step >= stepNum ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}
                      font-bold text-sm transition-all duration-300
                      shadow-lg
                    `}
                  >
                    {stepNum}
                  </div>
                  {index < 2 && (
                    <div className={`
                      w-16 h-1 mx-3
                      ${step > stepNum ? 'bg-blue-600' : 'bg-zinc-800'}
                      transition-all duration-300
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Program Information */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {/* Program Configuration */}
              <Card title={translations.step1Title[locale]}>
                                  <div className="space-y-6">
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${locale === "ar" ? 'text-right' : ''}`}>
                    <Select
                      label={translations.programType[locale]}
                      value={programType}
                      onChange={(e) => {
                        setProgramType(e.target.value);
                        setMajor(""); // Reset major when program type changes
                      }}
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
                    >
                      <option value="fullTime">{locale === "en" ? "Full-time" : "دوام كامل"}</option>
                      <option value="partTime">{locale === "en" ? "Part-time" : "دوام جزئي"}</option>
                    </Select>

                    {(programType === "foundation" || programType === "diploma" || programType === "tcp") && (
                      <Select
                        label={locale === "en" ? "Admission Date" : "تاريخ القبول"}
                        value={admissionDate}
                        onChange={(e) => setAdmissionDate(e.target.value)}
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
                      >
                        <option value="nonSponsored">{locale === "en" ? "Non-sponsored" : "غير مدعوم"}</option>
                        <option value="sponsored">{locale === "en" ? "Sponsored" : "مدعوم"}</option>
                      </Select>
                    )}
                  </div>
                </div>
              </Card>

              {/* Student Status */}
              <Card title={translations.studentStatus[locale]}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getStudentStatusOptions().map((option) => {
                      const isSelected = studentStatus === option.value;
                      const getColorClasses = () => {
                        if (!isSelected) return 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600';
                        
                        switch (option.color) {
                          case 'blue': return 'border-blue-500 bg-blue-500/10';
                          case 'purple': return 'border-purple-500 bg-purple-500/10';
                          case 'green': return 'border-green-500 bg-green-500/10';
                          case 'orange': return 'border-orange-500 bg-orange-500/10';
                          default: return 'border-blue-500 bg-blue-500/10';
                        }
                      };

                      const getRadioClasses = () => {
                        if (!isSelected) return 'border-zinc-400';
                        
                        switch (option.color) {
                          case 'blue': return 'border-blue-500 bg-blue-500';
                          case 'purple': return 'border-purple-500 bg-purple-500';
                          case 'green': return 'border-green-500 bg-green-500';
                          case 'orange': return 'border-orange-500 bg-orange-500';
                          default: return 'border-blue-500 bg-blue-500';
                        }
                      };

                      return (
                        <div
                          key={option.value}
                          className={`
                            p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${getColorClasses()}
                          `}
                          onClick={() => setStudentStatus(option.value)}
                        >
                          <div className={`flex items-start gap-3 ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                            <div className={`
                              w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center mt-0.5 flex-shrink-0
                              ${getRadioClasses()}
                            `}>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white transition-all duration-200" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-white text-sm leading-tight ${locale === "ar" ? 'mr-1' : ''}`}>{option.label}</div>
                              <div className={`text-xs text-zinc-400 mt-1 leading-tight ${locale === "ar" ? 'mr-1' : ''}`}>{option.description}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-zinc-700">
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
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Courses & Credit Hours */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <Card title={translations.step2Title[locale]}>
                <div className="space-y-6">
                  <Select
                    label={translations.numCourses[locale]}
                    value={numCourses.toString()}
                    onChange={(e) => setNumCourses(parseInt(e.target.value))}
                    className={locale === "ar" ? 'text-right' : ''}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num.toString()}>
                        {num} {locale === "en" ? (num === 1 ? "Course" : "Courses") : (num === 1 ? "مقرر" : "مقررات")}
                      </option>
                    ))}
                  </Select>

                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div key={course.id} className="p-4 bg-zinc-800/30 rounded-lg space-y-4">
                        <div className={`flex items-center justify-between ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                          <h4 className={`font-medium text-zinc-300 ${locale === "ar" ? 'ml-2' : 'mr-2'}`}>
                            {locale === "ar" 
                              ? index === 0 ? "المقرر الأول"
                              : index === 1 ? "المقرر الثاني"
                              : index === 2 ? "المقرر الثالث"
                              : index === 3 ? "المقرر الرابع"
                              : index === 4 ? "المقرر الخامس"
                              : index === 5 ? "المقرر السادس"
                              : index === 6 ? "المقرر السابع"
                              : "المقرر الثامن"
                              : `${translations.courseName[locale]} ${index + 1}`}
                          </h4>
                          {shouldShowRepeatedOption() && (
                            <Checkbox
                              label={translations.repeatedCourse[locale]}
                              checked={course.isRepeated}
                              onChange={(e) => updateCourse(index, 'isRepeated', e.target.checked)}
                              className={locale === "ar" ? 'mr-2' : ''}
                            />
                          )}
                        </div>
                        
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${locale === "ar" ? 'text-right' : ''}`}>
                          <Input
                            label={translations.courseName[locale]}
                            value={course.name}
                            onChange={(e) => updateCourse(index, 'name', e.target.value)}
                          />
                          <Input
                            label={translations.creditHours[locale]}
                            type="number"
                            min="1"
                            max="6"
                            value={course.credits}
                            onChange={(e) => updateCourse(index, 'credits', parseInt(e.target.value) || 3)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-zinc-700">
                    <Checkbox
                      label={`${translations.additionalFees[locale]} (${locale === "en" ? "Optional" : "اختياري"})`}
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
                          helperText={locale === "en" 
                            ? "Include housing, printing, administrative fees, etc."
                            : "يشمل السكن والطباعة والرسوم الإدارية وغيرها"
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card title={locale === "en" ? "Course Summary" : "ملخص المقررات"}>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {courses.reduce((sum, course) => sum + course.credits, 0)}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {locale === "en" ? "Total Credit Hours" : "إجمالي الساعات المعتمدة"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {courses.map((course) => (
                      <div key={course.id} className={`flex justify-between items-center p-2 bg-zinc-800/20 rounded ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm">{course.name}</span>
                        <div className={`flex items-center ${locale === "ar" ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                          <span className="text-blue-400">{course.credits} {locale === "en" ? "h" : "س"}</span>
                          {course.isRepeated && (
                            <span className={`text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded ${locale === "ar" ? "mr-2" : "ml-2"}`}>
                              {locale === "en" ? "Repeat" : "معاد"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasFullExemption() && (
                                          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                        <div className={`text-sm text-blue-300 font-medium ${locale === "ar" ? "text-right px-1" : ""}`}>
                          {locale === "en" ? "Tuition Exemption Applies!" : "تم تطبيق الإعفاء من الرسوم"}
                        </div>
                        <div className={`text-xs text-blue-200 mt-1 ${locale === "ar" ? "text-right px-1" : ""}`}>
                          {locale === "en" 
                            ? "No fees except for repeated courses"
                            : "لا توجد رسوم إلا للمقررات المعادة"
                          }
                        </div>
                      </div>
                  )}

                  <div className={`flex gap-3 pt-4 ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
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

          {/* Step 3: Fee Calculation Results */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <Card title={translations.step3Title[locale]} className="h-full">
                <div className="text-center mb-8">
                  <div className="inline-flex items-baseline">
                    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                      {feeBreakdown.total.toLocaleString()}
                    </span>
                    <span className={`text-lg text-zinc-400 ${locale === "ar" ? 'mr-2' : 'ml-2'}`}>{translations.qar[locale]}</span>
                  </div>
                  <p className="text-zinc-400 text-base mt-3">
                    {translations.totalSemesterFees[locale]}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`flex items-center justify-between ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-zinc-300 ${locale === "ar" ? 'ml-2' : 'mr-2'}`}>{translations.tuitionFees[locale]}</span>
                    <span className="font-semibold text-blue-400">
                      {hasFullExemption() && feeBreakdown.tuitionFees === 0 
                        ? translations.free[locale]
                        : `${feeBreakdown.tuitionFees.toLocaleString()} ${translations.qar[locale]}`
                      }
                    </span>
                  </div>
                  
                  <div className={`flex items-center justify-between ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-zinc-300 ${locale === "ar" ? 'ml-2' : 'mr-2'}`}>{translations.materialsSupplies[locale]}</span>
                    <span className="font-semibold text-green-400">
                      {hasFullExemption() && feeBreakdown.materialsSupplies === 0
                        ? translations.free[locale]
                        : `${feeBreakdown.materialsSupplies.toLocaleString()} ${translations.qar[locale]}`
                      }
                    </span>
                  </div>
                  
                  <div className={`flex items-center justify-between ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-zinc-300 ${locale === "ar" ? 'ml-2' : 'mr-2'}`}>{translations.studentServices[locale]}</span>
                    <span className="font-semibold text-purple-400">
                      {hasFullExemption() && feeBreakdown.studentServices === 0
                        ? translations.free[locale]
                        : `${feeBreakdown.studentServices.toLocaleString()} ${translations.qar[locale]}`
                      }
                    </span>
                  </div>
                  
                  {feeBreakdown.additionalFees > 0 && (
                    <div className={`flex items-center justify-between ${locale === "ar" ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-zinc-300 ${locale === "ar" ? 'ml-2' : 'mr-2'}`}>{translations.additionalFees[locale]}</span>
                      <span className="font-semibold text-orange-400">
                        {feeBreakdown.additionalFees.toLocaleString()} {translations.qar[locale]}
                      </span>
                    </div>
                  )}
                </div>

                {hasTuitionExemption() && (
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                    <div className={`flex items-start ${locale === "ar" ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                                                  <h4 className={`font-medium text-blue-300 mb-1 ${locale === "ar" ? "text-right px-1" : ""}`}>
                            {locale === "en" ? "Fee Exemption Applied" : "تم تطبيق الإعفاء من الرسوم"}
                          </h4>
                          <p className={`text-sm text-blue-100 ${locale === "ar" ? "text-right px-1" : ""}`}>
                            {hasFullExemption() 
                              ? (locale === "en" 
                                ? "Complete fee exemption applies. You only pay for repeated courses."
                                : "يُطبّق الإعفاء الكامل من الرسوم. تدفع فقط للمقررات المعادة."
                              )
                              : (locale === "en" 
                                ? `${studentStatus === "udst_employee_child" ? "50%" : "100%"} tuition waiver applied. Repeated courses are charged separately.`
                                : `تم تطبيق إعفاء ${studentStatus === "udst_employee_child" ? "50%" : "100%"} من الرسوم الدراسية. يتم تحصيل رسوم المقررات المعادة بشكل منفصل.`
                              )
                            }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(2)}
                  className="mt-4"
                >
                  {translations.previousStep[locale]}
                </Button>
              </Card>

              <Card title={locale === "en" ? "Program Summary" : "ملخص البرنامج"}>
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-800/20 rounded-lg">
                    <div className="text-sm text-zinc-400">{translations.programType[locale]}</div>
                    <div className="font-medium capitalize">
                      {programType === "foundation" && (locale === "en" ? "Foundation Program" : "برنامج التأسيسي")}
                      {programType === "bachelor" && (locale === "en" ? "Bachelor's Degree" : "درجة البكالوريوس")}
                      {programType === "graduate" && (locale === "en" ? "Master's Degree" : "درجة الماجستير")}
                      {programType === "tcp" && (locale === "en" ? "Technician Certificate" : "شهادة التقني")}
                      {programType === "diploma" && (locale === "en" ? "Diploma Program" : "برنامج الدبلوم")}
                      {programType === "postDiploma" && (locale === "en" ? "Post-Diploma" : "ما بعد الدبلوم")}
                      {programType === "preMaster" && (locale === "en" ? "Pre-Master" : "ما قبل الماجستير")}
                      {programType === "postgraduate" && (locale === "en" ? "Postgraduate Diploma" : "دبلوم الدراسات العليا")}
                    </div>
                  </div>

                  {major && (
                    <div className="p-3 bg-zinc-800/20 rounded-lg">
                      <div className="text-sm text-zinc-400">{translations.major[locale]}</div>
                      <div className="font-medium capitalize">
                        {major === "business" && (locale === "en" ? "Business Management" : "إدارة الأعمال")}
                        {major === "computing" && (locale === "en" ? "Computing & IT" : "الحاسوب وتكنولوجيا المعلومات")}
                        {major === "engineering" && (locale === "en" ? "Engineering & Technology" : "الهندسة والتكنولوجيا")}
                        {major === "generalEducation" && (locale === "en" ? "General Education" : "التعليم العام")}
                        {major === "healthSciences" && (locale === "en" ? "Health Sciences" : "العلوم الصحية")}
                        {major === "neonatalCare" && (locale === "en" ? "Neonatal Intensive Care" : "العناية المركزة لحديثي الولادة")}
                        {major === "stemEducation" && (locale === "en" ? "STEM/TVET Education" : "تعليم العلوم والتكنولوجيا")}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-zinc-800/20 rounded-lg">
                    <div className="text-sm text-zinc-400">{translations.enrollmentType[locale]}</div>
                    <div className="font-medium">
                      {enrollmentType === "fullTime" 
                        ? (locale === "en" ? "Full-time" : "دوام كامل")
                        : (locale === "en" ? "Part-time" : "دوام جزئي")
                      }
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-800/20 rounded-lg">
                    <div className="text-sm text-zinc-400">{translations.studentStatus[locale]}</div>
                    <div className="font-medium">
                      {getStudentStatusOptions().find(option => option.value === studentStatus)?.label}
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-800/20 rounded-lg">
                    <div className="text-sm text-zinc-400">{locale === "en" ? "Total Courses" : "إجمالي المقررات"}</div>
                    <div className="font-medium">{courses.length}</div>
                  </div>

                  <div className="p-3 bg-zinc-800/20 rounded-lg">
                    <div className="text-sm text-zinc-400">{locale === "en" ? "Total Credit Hours" : "إجمالي الساعات المعتمدة"}</div>
                    <div className="font-medium">{courses.reduce((sum, course) => sum + course.credits, 0)}</div>
                  </div>

                  {shouldShowRepeatedOption() && courses.some(course => course.isRepeated) && (
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="text-sm text-orange-300">
                        {locale === "en" ? "Repeated Courses" : "المقررات المعادة"}
                      </div>
                      <div className="font-medium text-orange-400">
                        {courses.filter(course => course.isRepeated).length}
                      </div>
                      <div className="text-xs text-orange-200 mt-1">
                        {locale === "en" 
                          ? "These courses will be charged tuition fees"
                          : "سيتم تحصيل رسوم دراسية لهذه المقررات"
                        }
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 