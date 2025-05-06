import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import PageHeader from "../components/ui/PageHeader";
import Footer from "../components/ui/Footer";
import { supabase } from "../utils/supabaseClient";

// Type for academic info data
type AcademicInfo = {
  id?: string;
  user_id?: string;
  total_grade_points: number;
  total_credits: number;
  current_subjects: number;
  created_at?: string;
  updated_at?: string;
};

export default function AcademicInfo() {
  const { user } = useAuth();
  const locale = useLocale();

  // State variables
  const [totalGradePoints, setTotalGradePoints] = useState<string>("");
  const [totalCredits, setTotalCredits] = useState<string>("");
  const [currentSubjects, setCurrentSubjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Translations
  const translations = {
    title: {
      en: "Academic Information",
      ar: "المعلومات الأكاديمية",
    },
    description: {
      en: "Manage your academic details used across the platform",
      ar: "إدارة تفاصيلك الأكاديمية المستخدمة عبر المنصة",
    },
    gradePointsLabel: {
      en: "Total Grade Points",
      ar: "مجموع نقاط الدرجات",
    },
    gradePointsHelper: {
      en: "The sum of all grade points earned so far",
      ar: "مجموع نقاط الدرجات المكتسبة حتى الآن",
    },
    creditsLabel: {
      en: "Total Credits",
      ar: "الساعات المعتمدة الإجمالية",
    },
    creditsHelper: {
      en: "The total number of credits completed",
      ar: "العدد الإجمالي للساعات المعتمدة المكتملة",
    },
    currentSubjectsLabel: {
      en: "Current Subjects",
      ar: "المواد الحالية",
    },
    currentSubjectsHelper: {
      en: "Number of subjects you're currently taking",
      ar: "عدد المواد التي تدرسها حاليًا",
    },
    saveButton: {
      en: "Save Changes",
      ar: "حفظ التغييرات",
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

  // Load academic info when component mounts
  useEffect(() => {
    if (user) {
      loadAcademicInfo();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Function to load academic info from database
  const loadAcademicInfo = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("academic_info")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading academic info:", error);
        setErrorMessage(translations.errorSaving[locale]);
      } else if (data) {
        // Populate form with data
        setTotalGradePoints(data.total_grade_points.toString());
        setTotalCredits(data.total_credits.toString());
        setCurrentSubjects(data.current_subjects);
      }
    } catch (err) {
      console.error("Unexpected error loading academic info:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to save academic info
  const saveAcademicInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Reset messages
    setSuccessMessage(null);
    setErrorMessage(null);
    setSaving(true);

    try {
      // Parse and validate values
      const gradePoints = parseFloat(totalGradePoints) || 0;
      const credits = parseFloat(totalCredits) || 0;

      // Create data object
      const academicData: AcademicInfo = {
        user_id: user.id,
        total_grade_points: gradePoints,
        total_credits: credits,
        current_subjects: currentSubjects,
        updated_at: new Date().toISOString(),
      };

      // Check if record exists, then update or insert
      const { data: existingData, error: fetchError } = await supabase
        .from("academic_info")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from("academic_info")
          .update(academicData)
          .eq("id", existingData.id);
      } else {
        // Insert new record
        result = await supabase.from("academic_info").insert([academicData]);
      }

      if (result.error) {
        throw result.error;
      }

      // Show success message
      setSuccessMessage(translations.savedSuccess[locale]);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving academic info:", err);
      setErrorMessage(translations.errorSaving[locale]);
    } finally {
      setSaving(false);
    }
  };

  // Calculate cumulative GPA based on input values
  const calculateGPA = (): number => {
    const gradePoints = parseFloat(totalGradePoints) || 0;
    const credits = parseFloat(totalCredits) || 0;

    if (credits === 0) return 0;
    return Math.min(4.0, Math.max(0, gradePoints / credits));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
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

          <div className="grid grid-cols-1 gap-6">
            {/* GPA Overview */}
            <Card>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {loading
                    ? translations.calculating[locale]
                    : calculateGPA().toFixed(2)}
                </div>
                <div className="text-zinc-400">
                  {translations.cumulativeGPA[locale]}
                </div>

                {/* Credits and Grade Points Display */}
                <div className="grid grid-cols-2 gap-6 mt-6 w-full max-w-md">
                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="text-xl font-semibold text-white">
                      {loading ? "..." : totalCredits || "0"}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {translations.creditsLabel[locale]}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="text-xl font-semibold text-white">
                      {loading ? "..." : totalGradePoints || "0"}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {translations.gradePointsLabel[locale]}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Academic Info Form */}
            <Card
              title={
                locale === "ar"
                  ? "تفاصيل المعلومات الأكاديمية"
                  : "Academic Details"
              }
            >
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-zinc-400">
                      {translations.loadingData[locale]}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveAcademicInfo} className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={translations.gradePointsLabel[locale]}
                      type="number"
                      min="0"
                      step="0.1"
                      value={totalGradePoints}
                      onChange={(e) => setTotalGradePoints(e.target.value)}
                      helperText={translations.gradePointsHelper[locale]}
                    />

                    <Input
                      label={translations.creditsLabel[locale]}
                      type="number"
                      min="0"
                      step="1"
                      value={totalCredits}
                      onChange={(e) => setTotalCredits(e.target.value)}
                      helperText={translations.creditsHelper[locale]}
                    />
                  </div>

                  <Select
                    label={translations.currentSubjectsLabel[locale]}
                    value={currentSubjects}
                    onChange={(e) =>
                      setCurrentSubjects(parseInt(e.target.value))
                    }
                    helperText={translations.currentSubjectsHelper[locale]}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      translations.saveButton[locale]
                    )}
                  </button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
