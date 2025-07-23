import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import Footer from "../components/ui/Footer";
import { courseRequestService } from "../services/courseRequestService";
import type { CourseRequestFormData, StudentEntry } from "../types/database";
import { nanoid } from "nanoid";

export default function CourseRequest() {
  const { user } = useAuth();
  const locale = useLocale();

  // State variables
  const [formData, setFormData] = useState<CourseRequestFormData>({
    creatorName: "",
    creatorStudentId: "",
    courseName: "",
    students: [{ id: nanoid(6), name: "", studentId: "" }],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setGeneratedSlug] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Translations
  const translations = {
    title: {
      en: "Course Request Generator",
      ar: "إنشاء طلب فتح مقرر",
    },
    description: {
      en: "Create and share a link for requesting a new course section",
      ar: "إنشاء ومشاركة رابط لطلب فتح شعبة جديدة لمقرر دراسي",
    },
    creatorNameLabel: {
      en: "Your Name",
      ar: "اسمك",
    },
    creatorNameHelper: {
      en: "Enter your full name as registered at UDST",
      ar: "أدخل اسمك الكامل كما هو مسجل في UDST",
    },
    creatorStudentIdLabel: {
      en: "Your Student ID",
      ar: "رقم الطالب الخاص بك",
    },
    creatorStudentIdHelper: {
      en: "Enter your student ID",
      ar: "أدخل رقم الطالب الخاص بك",
    },
    courseNameLabel: {
      en: "Course Name",
      ar: "اسم المادة",
    },
    courseNameHelper: {
      en: "Enter the full course name and code (e.g. MATH 101: Calculus I)",
      ar: "أدخل اسم المادة الكامل ورمزه (مثال: MATH 101: حساب التفاضل والتكامل 1)",
    },
    interestedStudentsLabel: {
      en: "Interested Students",
      ar: "الطلاب المهتمون",
    },
    interestedStudentsHelper: {
      en: "Add students who are interested in this course",
      ar: "أضف الطلاب المهتمين بهذه المادة",
    },
    studentNameLabel: {
      en: "Student Name",
      ar: "اسم الطالب",
    },
    studentIdLabel: {
      en: "Student ID",
      ar: "رقم الطالب",
    },
    addMoreStudentsButton: {
      en: "Add Another Student",
      ar: "إضافة طالب آخر",
    },
    removeStudentButton: {
      en: "Remove",
      ar: "إزالة",
    },
    generateLinkButton: {
      en: "Generate Request Link",
      ar: "إنشاء رابط الطلب",
    },
    generatingLink: {
      en: "Generating...",
      ar: "جاري الإنشاء...",
    },
    linkGeneratedSuccess: {
      en: "Course request link generated successfully!",
      ar: "تم إنشاء رابط طلب المادة بنجاح!",
    },
    errorGeneratingLink: {
      en: "Error generating course request link",
      ar: "خطأ في إنشاء رابط طلب المادة",
    },
    shareLinkText: {
      en: "Share this link with your department coordinator:",
      ar: "شارك هذا الرابط مع منسق القسم:",
    },
    copyLinkButton: {
      en: "Copy Link",
      ar: "نسخ الرابط",
    },
    linkCopied: {
      en: "Link copied!",
      ar: "تم نسخ الرابط!",
    },
    requiredField: {
      en: "This field is required",
      ar: "هذا الحقل مطلوب",
    },
    invalidForm: {
      en: "Please fill in all required fields",
      ar: "يرجى ملء جميع الحقول المطلوبة",
    },
    minStudentsRequired: {
      en: "Please add at least one interested student",
      ar: "يرجى إضافة طالب مهتم واحد على الأقل",
    },
    loginRequired: {
      en: "You must be logged in to create a course request",
      ar: "يجب أن تكون مسجل الدخول لإنشاء طلب مقرر",
    },
  };

  // Function to update form data
  const updateFormData = (
    field: keyof CourseRequestFormData,
    value: string | StudentEntry[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update student data
  const updateStudent = (
    id: string,
    field: keyof Omit<StudentEntry, "id">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      students: prev.students.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      ),
    }));
  };

  // Add a new student row
  const addStudentRow = () => {
    setFormData((prev) => ({
      ...prev,
      students: [...prev.students, { id: nanoid(6), name: "", studentId: "" }],
    }));
  };

  // Remove a student row
  const removeStudentRow = (id: string) => {
    if (formData.students.length <= 1) return; // Keep at least one row
    setFormData((prev) => ({
      ...prev,
      students: prev.students.filter((student) => student.id !== id),
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    // Check required fields
    if (
      !formData.creatorName ||
      !formData.creatorStudentId ||
      !formData.courseName
    ) {
      setErrorMessage(translations.invalidForm[locale]);
      return false;
    }

    // Validate students
    const validStudents = formData.students.filter(
      (s) => s.name && s.studentId
    );
    if (validStudents.length === 0) {
      setErrorMessage(translations.minStudentsRequired[locale]);
      return false;
    }

    return true;
  };

  // Generate course request link
  const generateLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage(translations.loginRequired[locale]);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // Create database entry
      const result = await courseRequestService.createCourseRequest(formData, user.id);

      if (result.error) {
        throw new Error(result.error);
      }

      // Set the generated slug and build the link
      const slug = result.data?.slug;
      if (slug) {
      setGeneratedSlug(slug);

      // Build absolute URL based on current window location
      const baseUrl = window.location.origin;
      const requestUrl = `${baseUrl}/${locale}/view-request/${slug}`;
      setGeneratedLink(requestUrl);
      }

      setSuccessMessage(translations.linkGeneratedSuccess[locale]);
    } catch (err) {
      console.error("Error generating course request:", err);
      setErrorMessage(translations.errorGeneratingLink[locale]);
    } finally {
      setLoading(false);
    }
  };

  // Handle copy link to clipboard
  const copyLinkToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);

      // Reset copied status after 2 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    }
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

          {/* Generated Link Section - shown after successful generation */}
          {generatedLink && (
            <Card title={locale === "ar" ? "رابط الطلب" : "Request Link"}>
              <div className="space-y-4">
                <div className="p-4 text-sm text-white bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                  {successMessage}
                </div>

                <div className="mt-4">
                  <p className="text-zinc-300 mb-2">
                    {translations.shareLinkText[locale]}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      onClick={copyLinkToClipboard}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg ${
                        linkCopied
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white font-medium transition-colors`}
                    >
                      {linkCopied
                        ? translations.linkCopied[locale]
                        : translations.copyLinkButton[locale]}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Course Request Form */}
          <Card
            title={
              locale === "ar"
                ? "معلومات طلب المادة"
                : "Course Request Information"
            }
          >
            <form onSubmit={generateLink} className="space-y-6">
              {errorMessage && (
                <div className="p-3 text-sm text-white bg-red-500/20 border border-red-500/50 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={translations.creatorNameLabel[locale]}
                  value={formData.creatorName}
                  onChange={(e) =>
                    updateFormData("creatorName", e.target.value)
                  }
                  helperText={translations.creatorNameHelper[locale]}
                  required
                />

                <Input
                  label={translations.creatorStudentIdLabel[locale]}
                  value={formData.creatorStudentId}
                  onChange={(e) =>
                    updateFormData("creatorStudentId", e.target.value)
                  }
                  helperText={translations.creatorStudentIdHelper[locale]}
                  required
                />
              </div>

              <Input
                label={translations.courseNameLabel[locale]}
                value={formData.courseName}
                onChange={(e) => updateFormData("courseName", e.target.value)}
                helperText={translations.courseNameHelper[locale]}
                required
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-1">
                    {translations.interestedStudentsLabel[locale]}
                  </label>
                  <p className="text-sm text-zinc-400 mb-4">
                    {translations.interestedStudentsHelper[locale]}
                  </p>
                </div>

                {formData.students.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50"
                  >
                    <div className="md:col-span-2">
                      <label className="block text-white text-sm font-medium mb-1">
                        {translations.studentNameLabel[locale]}
                      </label>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) =>
                          updateStudent(student.id, "name", e.target.value)
                        }
                        className="w-full bg-zinc-900/70 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        placeholder={
                          locale === "ar" ? "اسم الطالب" : "Student name"
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-white text-sm font-medium mb-1">
                        {translations.studentIdLabel[locale]}
                      </label>
                      <input
                        type="text"
                        value={student.studentId}
                        onChange={(e) =>
                          updateStudent(student.id, "studentId", e.target.value)
                        }
                        className="w-full bg-zinc-900/70 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        placeholder={
                          locale === "ar" ? "رقم الطالب" : "Student ID"
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end justify-end h-full">
                      <button
                        type="button"
                        onClick={() => removeStudentRow(student.id)}
                        disabled={formData.students.length <= 1}
                        className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {translations.removeStudentButton[locale]}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addStudentRow}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium border border-zinc-700/50 transition-colors"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    {translations.addMoreStudentsButton[locale]}
                  </span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
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
                    {translations.generatingLink[locale]}
                  </div>
                ) : (
                  translations.generateLinkButton[locale]
                )}
              </button>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
