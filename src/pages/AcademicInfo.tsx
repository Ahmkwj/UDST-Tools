import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import PageHeader from "../components/ui/PageHeader";
import Footer from "../components/ui/Footer";
import { useAcademicInfo } from "../hooks/useAcademicInfo";
import type { AcademicInfo } from "../types/database";

export default function AcademicInfo() {
  const { user } = useAuth();
  const locale = useLocale();
  
  // Form state
  const [totalGradePoints, setTotalGradePoints] = useState<string>("");
  const [totalCredits, setTotalCredits] = useState<string>("");
  const [currentSubjects, setCurrentSubjects] = useState<number>(0);

  // Use the new academic info hook
  const {
    academicInfo,
    loading,
    saving,
    error: serviceError,
    saveAcademicInfo,
    clearError,
  } = useAcademicInfo(user?.id || null);

  // Local state for form messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const translations = {
    title: {
      en: "Academic Information",
      ar: "المعلومات الأكاديمية",
    },
    description: {
      en: "Manage your academic data for GPA calculations",
      ar: "إدارة بياناتك الأكاديمية لحسابات المعدل",
    },
    totalGradePointsLabel: {
      en: "Total Grade Points",
      ar: "مجموع نقاط الدرجات",
    },
    totalGradePointsHelper: {
      en: "Enter the total grade points from all completed courses",
      ar: "أدخل مجموع نقاط الدرجات من جميع المواد المكتملة",
    },
    totalCreditsLabel: {
      en: "Total Credits",
      ar: "مجموع الساعات المعتمدة",
    },
    totalCreditsHelper: {
      en: "Enter the total credit hours from all completed courses",
      ar: "أدخل مجموع الساعات المعتمدة من جميع المواد المكتملة",
    },
    currentSubjectsLabel: {
      en: "Current Subjects",
      ar: "المواد الحالية",
    },
    currentSubjectsHelper: {
      en: "Number of subjects you are currently enrolled in",
      ar: "عدد المواد المسجل بها حالياً",
    },
    saveButton: {
      en: "Save Information",
      ar: "حفظ المعلومات",
    },
    saving: {
      en: "Saving...",
      ar: "جاري الحفظ...",
    },
    savedSuccess: {
      en: "Academic information saved successfully",
      ar: "تم حفظ المعلومات الأكاديمية بنجاح",
    },
    errorSaving: {
      en: "Error saving academic information",
      ar: "خطأ في حفظ المعلومات الأكاديمية",
    },
    cumulativeGPA: {
      en: "Cumulative GPA",
      ar: "المعدل التراكمي",
    },
    calculating: {
      en: "Calculating...",
      ar: "جاري الحساب...",
    },
    loadingData: {
      en: "Loading your academic information...",
      ar: "جاري تحميل معلوماتك الأكاديمية...",
    },
  };

  // Populate form when academic info is loaded
  useEffect(() => {
    if (academicInfo) {
      setTotalGradePoints(academicInfo.total_grade_points.toString());
      setTotalCredits(academicInfo.total_credits.toString());
      setCurrentSubjects(academicInfo.current_subjects);
    }
  }, [academicInfo]);

  // Handle service errors
  useEffect(() => {
    if (serviceError) {
      setErrorMessage(serviceError);
    }
  }, [serviceError]);

  // Function to save academic info
  const handleSaveAcademicInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Clear previous messages
    setSuccessMessage(null);
    setErrorMessage(null);
    clearError();

    // Parse and validate values
    const gradePoints = parseFloat(totalGradePoints) || 0;
    const credits = parseFloat(totalCredits) || 0;

    // Basic validation
    if (gradePoints < 0) {
      setErrorMessage(locale === "ar" ? "نقاط الدرجات لا يمكن أن تكون سالبة" : "Grade points cannot be negative");
      return;
    }

    if (credits < 0) {
      setErrorMessage(locale === "ar" ? "الساعات المعتمدة لا يمكن أن تكون سالبة" : "Credits cannot be negative");
      return;
    }

    if (currentSubjects < 0) {
      setErrorMessage(locale === "ar" ? "عدد المواد الحالية لا يمكن أن يكون سالباً" : "Current subjects cannot be negative");
      return;
    }

    // Create data object
    const academicData: Omit<AcademicInfo, 'id' | 'created_at'> = {
      user_id: user.id,
      total_grade_points: gradePoints,
      total_credits: credits,
      current_subjects: currentSubjects,
      updated_at: new Date().toISOString(),
    };

    const result = await saveAcademicInfo(academicData);

    if (result.success) {
      setSuccessMessage(translations.savedSuccess[locale]);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } else {
      setErrorMessage(result.error || translations.errorSaving[locale]);
    }
  };

  // Calculate cumulative GPA
  const calculateGPA = () => {
    const gradePoints = parseFloat(totalGradePoints) || 0;
    const credits = parseFloat(totalCredits) || 0;
    
    if (credits === 0) return 0;
    const gpa = gradePoints / credits;
    return Math.min(4.0, Math.max(0, gpa)); // Ensure GPA is between 0 and 4.0
  };

  if (!user) {
    return (
      <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
          <PageHeader 
            title={{
              en: translations.title.en,
              ar: translations.title.ar,
            }}
            description={{
              en: translations.description.en,
              ar: translations.description.ar,
            }}
          />
          <div className="w-full max-w-2xl mx-auto">
            <Card>
              <p className="text-center text-zinc-400">
                {locale === "ar" ? "يرجى تسجيل الدخول لعرض المعلومات الأكاديمية" : "Please sign in to view academic information"}
              </p>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <PageHeader 
          title={{
            en: translations.title.en,
            ar: translations.title.ar,
          }}
          description={{
            en: translations.description.en,
            ar: translations.description.ar,
          }}
        />

        <div className="w-full max-w-2xl mx-auto">
          <Card>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-zinc-400">{translations.loadingData[locale]}</p>
              </div>
            ) : (
              <form onSubmit={handleSaveAcademicInfo} className="space-y-6">
                {errorMessage && (
                  <div className="p-3 text-sm text-white bg-red-500/20 border border-red-500/50 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 text-sm text-white bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                    {successMessage}
                  </div>
                )}

                <Input
                  label={translations.totalGradePointsLabel[locale]}
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalGradePoints}
                  onChange={(e) => setTotalGradePoints(e.target.value)}
                  helperText={translations.totalGradePointsHelper[locale]}
                  required
                />

                <Input
                  label={translations.totalCreditsLabel[locale]}
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalCredits}
                  onChange={(e) => setTotalCredits(e.target.value)}
                  helperText={translations.totalCreditsHelper[locale]}
                  required
                />

                <Select
                  label={translations.currentSubjectsLabel[locale]}
                  value={currentSubjects.toString()}
                  onChange={(e) => setCurrentSubjects(parseInt(e.target.value) || 0)}
                  helperText={translations.currentSubjectsHelper[locale]}
                  required
                >
                  {Array.from({ length: 21 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>

                {/* Display calculated GPA */}
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {translations.cumulativeGPA[locale]}
                  </h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {totalGradePoints && totalCredits 
                      ? calculateGPA().toFixed(2)
                      : "--"
                    }
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    w-full px-4 py-2.5 rounded-lg font-medium transition-colors duration-200
                    ${saving
                      ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }
                  `}
                >
                  {saving ? translations.saving[locale] : translations.saveButton[locale]}
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
