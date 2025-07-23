import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Footer from "../components/ui/Footer";
import { courseRequestService } from "../services/courseRequestService";
import type { CourseRequest, InterestedStudent } from "../types/database";

export default function ViewCourseRequest() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();

  const [request, setRequest] = useState<CourseRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  // Form for adding new students
  const [newStudentName, setNewStudentName] = useState<string>("");
  const [newStudentId, setNewStudentId] = useState<string>("");
  const [addingStudent, setAddingStudent] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Translations
  const translations = {
    title: {
      en: "Course Request",
      ar: "طلب فتح مقرر",
    },
    description: {
      en: "View details of the requested course section",
      ar: "عرض تفاصيل طلب فتح شعبة المادة",
    },
    loading: {
      en: "Loading request information...",
      ar: "جاري تحميل معلومات الطلب...",
    },
    errorTitle: {
      en: "Request Not Found",
      ar: "الطلب غير موجود",
    },
    errorMessage: {
      en: "The requested course request information could not be found.",
      ar: "لم يتم العثور على معلومات طلب المادة المطلوب.",
    },
    createdBy: {
      en: "Created by",
      ar: "أنشئ بواسطة",
    },
    requestedCourse: {
      en: "Requested Course",
      ar: "المادة المطلوبة",
    },
    studentId: {
      en: "Student ID",
      ar: "رقم الطالب",
    },
    createdOn: {
      en: "Request Created On",
      ar: "تاريخ إنشاء الطلب",
    },
    interestedStudents: {
      en: "Interested Students",
      ar: "الطلاب المهتمون",
    },
    studentCount: {
      en: "students interested in this course",
      ar: "طالب مهتم بهذه المادة",
    },
    name: {
      en: "Name",
      ar: "الاسم",
    },
    id: {
      en: "ID",
      ar: "الرقم",
    },
    printPage: {
      en: "Print This List",
      ar: "طباعة هذه القائمة",
    },
    addYourName: {
      en: "Add Your Name",
      ar: "أضف اسمك",
    },
    yourName: {
      en: "Your Name",
      ar: "اسمك",
    },
    yourStudentId: {
      en: "Your Student ID",
      ar: "رقم الطالب الخاص بك",
    },
    nameRequired: {
      en: "Your name is required",
      ar: "اسمك مطلوب",
    },
    idRequired: {
      en: "Your student ID is required",
      ar: "رقم الطالب الخاص بك مطلوب",
    },
    submit: {
      en: "Add Me to This Course",
      ar: "أضفني لهذه المادة",
    },
    adding: {
      en: "Adding...",
      ar: "جاري الإضافة...",
    },
    successAdded: {
      en: "You've been added to the course request!",
      ar: "تمت إضافتك إلى طلب المادة!",
    },
    errorAdding: {
      en: "Error adding you to the course request",
      ar: "خطأ في إضافتك إلى طلب المادة",
    },
    expiresIn: {
      en: "This request expires in",
      ar: "ينتهي هذا الطلب خلال",
    },
    days: {
      en: "days",
      ar: "أيام",
    },
    day: {
      en: "day",
      ar: "يوم",
    },
    duplicateError: {
      en: "A student with this ID is already added",
      ar: "تمت إضافة طالب بهذا الرقم بالفعل",
    },
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate days remaining until expiration
  const calculateDaysRemaining = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Load course request data
  useEffect(() => {
    const fetchCourseRequest = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!slug) {
          setError("No request ID provided");
          return;
        }

        const result = await courseRequestService.getCourseRequestBySlug(slug);

        if (result.error) {
          console.error("Error fetching course request:", result.error);
          setError(result.error);
          return;
        }

        if (!result.data) {
          setError("Course request not found");
          return;
        }

        setRequest(result.data);

        // Calculate days remaining
        if (result.data.expiration_date) {
          setDaysRemaining(calculateDaysRemaining(result.data.expiration_date));
        }
      } catch (err) {
        console.error("Unexpected error fetching course request:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseRequest();
  }, [slug]);

  // Handle adding student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!newStudentName.trim()) {
      setErrorMessage(translations.nameRequired[locale]);
      return;
    }

    if (!newStudentId.trim()) {
      setErrorMessage(translations.idRequired[locale]);
      return;
    }

    // Check for duplicates
    const isDuplicate = request?.interested_students.some(
      (student) => student.student_id === newStudentId.trim()
    );

    if (isDuplicate) {
      setErrorMessage(translations.duplicateError[locale]);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setAddingStudent(true);

    try {
      if (!slug) {
        throw new Error("Course request not found");
      }

      // Add new student
      const newStudent: InterestedStudent = {
          name: newStudentName.trim(),
          student_id: newStudentId.trim(),
      };

      // Update the database
      const result = await courseRequestService.addStudentToCourseRequest(slug, newStudent);

      if (result.error) {
        throw new Error(result.error);
      }

      // Update local state
      setRequest(result.data);

      // Show success message and clear form
      setSuccessMessage(translations.successAdded[locale]);
      setNewStudentName("");
      setNewStudentId("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error adding student:", err);
      setErrorMessage(translations.errorAdding[locale]);
    } finally {
      setAddingStudent(false);
    }
  };

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-zinc-400 text-lg">
                {translations.loading[locale]}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error || !request) {
    return (
      <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto">
            <Card title={translations.errorTitle[locale]}>
              <div className="flex flex-col items-center justify-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-red-500 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <p className="text-lg text-center text-zinc-300 mb-4">
                  {translations.errorMessage[locale]}
                </p>
                <p className="text-sm text-zinc-500">{error}</p>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main render
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white print:bg-white print:text-black">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration - hidden when printing */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Print button - hidden when printing */}
          <div className="flex justify-between items-center mb-4 print:hidden">
            <div className="px-4 py-2 rounded-lg bg-amber-600/20 border border-amber-600/30 text-amber-400">
              <span className="font-medium">
                {translations.expiresIn[locale]}: {daysRemaining}{" "}
                {daysRemaining === 1
                  ? translations.day[locale]
                  : translations.days[locale]}
              </span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
            >
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
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                />
              </svg>
              {translations.printPage[locale]}
            </button>
          </div>

          {/* Page header - condensed when printing */}
          <div className="print:hidden">
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
          </div>

          {/* Print-only header */}
          <div className="hidden print:block text-center mb-8">
            <h1 className="text-3xl font-bold">{translations.title[locale]}</h1>
            <div className="h-1 w-16 mx-auto bg-gray-300 my-4"></div>
          </div>

          {/* Course Request Details Card */}
          <Card
            title={request.course_name}
            className="print:border print:shadow-none print:border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-zinc-400 text-sm mb-1 print:text-gray-600">
                  {translations.createdBy[locale]}
                </h3>
                <p className="text-white text-lg font-medium print:text-black">
                  {request.creator_name}
                </p>
              </div>

              <div>
                <h3 className="text-zinc-400 text-sm mb-1 print:text-gray-600">
                  {translations.studentId[locale]}
                </h3>
                <p className="text-white text-lg font-medium print:text-black">
                  {request.creator_student_id}
                </p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-zinc-400 text-sm mb-1 print:text-gray-600">
                  {translations.createdOn[locale]}
                </h3>
                <p className="text-white text-lg font-medium print:text-black">
                  {formatDate(request.created_at)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 border-b border-zinc-800 pb-2 print:border-gray-300 print:text-black">
                {translations.interestedStudents[locale]}
                <span className="text-sm font-normal text-zinc-400 ml-2 print:text-gray-600">
                  ({request.interested_students.length}{" "}
                  {translations.studentCount[locale]})
                </span>
              </h3>

              <div className="overflow-hidden rounded-lg border border-zinc-800 print:border-gray-300">
                <table className="min-w-full divide-y divide-zinc-800 print:divide-gray-300">
                  <thead className="bg-zinc-900/50 print:bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider print:text-gray-700"
                      >
                        {translations.name[locale]}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider print:text-gray-700"
                      >
                        {translations.id[locale]}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-900/20 divide-y divide-zinc-800 print:bg-white print:divide-gray-200">
                    {request.interested_students.map((student, index) => (
                      <tr
                        key={index}
                        className="hover:bg-zinc-800/30 transition-colors print:hover:bg-transparent"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white print:text-black">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 print:text-gray-900">
                          {student.student_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Add Your Name Card - hidden when printing */}
          <Card
            title={translations.addYourName[locale]}
            className="print:hidden"
          >
            <form onSubmit={handleAddStudent} className="space-y-6">
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
                <div>
                  <label className="block text-white font-medium mb-1">
                    {translations.yourName[locale]}
                  </label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-1">
                    {translations.yourStudentId[locale]}
                  </label>
                  <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addingStudent}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                {addingStudent ? (
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
                    {translations.adding[locale]}
                  </div>
                ) : (
                  translations.submit[locale]
                )}
              </button>
            </form>
          </Card>
        </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
