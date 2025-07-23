import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { swapRequestService } from "../services/swapRequestService";
import type { SwapRequest, SwapRequestFormData } from "../types/database";

export default function SwapWithMe() {
  const { user } = useAuth();
  const locale = useLocale();

  // State variables
  const [formData, setFormData] = useState<SwapRequestFormData>({
    courseName: "",
    currentSection: "",
    targetSection: "",
    studentId: "",
  });
  const [allRequests, setAllRequests] = useState<SwapRequest[]>([]);
  const [myRequests, setMyRequests] = useState<SwapRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Translations
  const translations = {
    title: {
      en: "Swap With Me",
      ar: "تبادل المادة معي",
    },
    description: {
      en: "Find students to swap course sections with",
      ar: "ابحث عن طلاب للتبادل معهم في شعب المواد",
    },
    courseNameLabel: {
      en: "Course Name",
      ar: "اسم المادة",
    },
    courseNameHelper: {
      en: "Enter the full course name and code (e.g. MATH 101: Calculus I)",
      ar: "أدخل اسم المادة الكامل ورمزه (مثال: MATH 101: حساب التفاضل والتكامل 1)",
    },
    currentSectionLabel: {
      en: "Your Current Section",
      ar: "الشعبة الحالية الخاصة بك",
    },
    currentSectionHelper: {
      en: "Enter your current section number",
      ar: "أدخل رقم الشعبة الحالية الخاصة بك",
    },
    targetSectionLabel: {
      en: "Desired Section",
      ar: "الشعبة المطلوبة",
    },
    targetSectionHelper: {
      en: "Enter the section number you want to switch to",
      ar: "أدخل رقم الشعبة التي ترغب في الانتقال إليها",
    },
    studentIdLabel: {
      en: "Your Student ID",
      ar: "رقم الطالب الخاص بك",
    },
    studentIdHelper: {
      en: "Enter your student ID",
      ar: "أدخل رقم الطالب الخاص بك",
    },
    postRequestButton: {
      en: "Post Swap Request",
      ar: "نشر طلب التبادل",
    },
    requestPosting: {
      en: "Posting...",
      ar: "جاري النشر...",
    },
    allRequestsTab: {
      en: "All Requests",
      ar: "جميع الطلبات",
    },
    myRequestsTab: {
      en: "My Requests",
      ar: "طلباتي",
    },
    noRequestsFound: {
      en: "No swap requests found",
      ar: "لم يتم العثور على طلبات تبادل",
    },
    createFirstRequest: {
      en: "Create your first swap request",
      ar: "أنشئ أول طلب تبادل خاص بك",
    },
    postedBy: {
      en: "Posted by",
      ar: "تم النشر بواسطة",
    },
    studentIdDisplay: {
      en: "Student ID",
      ar: "رقم الطالب",
    },
    wantToSwap: {
      en: "Section",
      ar: "السكشن",
    },
    currentSection: {
      en: "Current",
      ar: "الحالي",
    },
    targetSection: {
      en: "Desired",
      ar: "المطلوبة",
    },
    postedTime: {
      en: "Posted",
      ar: "تم النشر منذ",
    },
    expires: {
      en: "Expires",
      ar: "ينتهي في",
    },
    contactRequester: {
      en: "Contact Requester",
      ar: "التواصل مع مقدم الطلب",
    },
    cancelRequest: {
      en: "Cancel Request",
      ar: "إلغاء الطلب",
    },
    requestSuccess: {
      en: "Your swap request has been posted successfully",
      ar: "تم نشر طلب التبادل الخاص بك بنجاح",
    },
    requestError: {
      en: "Error posting swap request. Please try again later.",
      ar: "خطأ في نشر طلب التبادل. يرجى المحاولة مرة أخرى لاحقًا.",
    },
    cancelConfirmation: {
      en: "Are you sure you want to cancel this request?",
      ar: "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟",
    },
    cancelSuccess: {
      en: "Your swap request has been cancelled",
      ar: "تم إلغاء طلب التبادل الخاص بك",
    },
    cancelError: {
      en: "Error cancelling swap request. Please try again later.",
      ar: "خطأ في إلغاء طلب التبادل. يرجى المحاولة مرة أخرى لاحقًا.",
    },
    confirmButton: {
      en: "Confirm",
      ar: "تأكيد",
    },
    cancelButton: {
      en: "Cancel",
      ar: "إلغاء",
    },
    emailTo: {
      en: "Email to",
      ar: "أرسل بريدًا إلكترونيًا إلى",
    },
    requestClosed: {
      en: "This request has been closed",
      ar: "تم إغلاق هذا الطلب",
    },
  };

  // Load swap requests when component mounts
  useEffect(() => {
    loadSwapRequests();
  }, [user]);

  const loadSwapRequests = async () => {
    try {
      setLoadingRequests(true);

      // Fetch all open requests
      const allRequestsResult = await swapRequestService.getOpenSwapRequests();
      setAllRequests(allRequestsResult.data);

      // If user is logged in, fetch their requests
      if (user) {
        const myRequestsResult = await swapRequestService.getSwapRequestsByUser(user.id);
        setMyRequests(myRequestsResult.data);
      }
    } catch (error) {
      console.error("Error loading swap requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Update form data
  const updateFormData = (key: keyof SwapRequestFormData, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage(
        locale === "ar"
          ? "يرجى تسجيل الدخول أولاً"
          : "Please sign in first"
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await swapRequestService.createSwapRequest(
        formData,
        user.id,
        user.email || "",
        user.user_metadata?.name || ""
      );

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage(translations.requestSuccess[locale]);
        // Reset form
        setFormData({
          courseName: "",
          currentSection: "",
          targetSection: "",
          studentId: "",
        });
        // Reload requests
        loadSwapRequests();
      }
    } catch (error) {
      console.error("Error creating swap request:", error);
      setErrorMessage(translations.requestError[locale]);
    } finally {
      setLoading(false);
    }
  };

  // Handle request cancellation
  const handleCancelRequest = async (requestId: number) => {
    if (!window.confirm(translations.cancelConfirmation[locale]) || !user) {
      return;
    }

    try {
      const result = await swapRequestService.updateSwapRequestStatus(
        requestId,
        "closed",
        user.id
      );

      if (result.error) {
        alert(translations.cancelError[locale]);
      } else {
        alert(translations.cancelSuccess[locale]);
        // Reload requests
        loadSwapRequests();
      }
    } catch (error) {
      console.error("Error cancelling swap request:", error);
      alert(translations.cancelError[locale]);
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: locale === "ar" ? ar : enUS,
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format expiry date
  const formatExpiryDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Determine which requests to display based on active tab
  const displayedRequests = activeTab === "all" ? allRequests : myRequests;

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

          {/* Create Swap Request Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                label={translations.courseNameLabel[locale]}
                value={formData.courseName}
                onChange={(e) => updateFormData("courseName", e.target.value)}
                helperText={translations.courseNameHelper[locale]}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={translations.currentSectionLabel[locale]}
                  value={formData.currentSection}
                  onChange={(e) =>
                    updateFormData("currentSection", e.target.value)
                  }
                  helperText={translations.currentSectionHelper[locale]}
                  required
                />

                <Input
                  label={translations.targetSectionLabel[locale]}
                  value={formData.targetSection}
                  onChange={(e) =>
                    updateFormData("targetSection", e.target.value)
                  }
                  helperText={translations.targetSectionHelper[locale]}
                  required
                />
              </div>

              <Input
                label={translations.studentIdLabel[locale]}
                value={formData.studentId}
                onChange={(e) => updateFormData("studentId", e.target.value)}
                helperText={translations.studentIdHelper[locale]}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                {loading
                  ? translations.requestPosting[locale]
                  : translations.postRequestButton[locale]}
              </button>
            </form>
          </Card>

          {/* Swap Requests List */}
          <div>
            {/* Tabs */}
            <div className="flex space-x-2 mb-4 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {translations.allRequestsTab[locale]}
              </button>
              <button
                onClick={() => setActiveTab("mine")}
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === "mine"
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {translations.myRequestsTab[locale]}
              </button>
            </div>

            {/* Requests list */}
            {loadingRequests ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : displayedRequests.length === 0 ? (
              <div className="text-center py-12 px-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {translations.noRequestsFound[locale]}
                </h3>
                {activeTab === "mine" && (
                  <p className="text-zinc-400 text-sm">
                    {translations.createFirstRequest[locale]}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 md:p-6 bg-zinc-900/70 backdrop-blur-sm ring-1 ring-zinc-800/50 rounded-xl"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {request.course_name}
                        </h3>
                        <p className="text-zinc-400 text-sm mb-4">
                          {translations.postedBy[locale]}:{" "}
                          {request.creator_name} &bull;{" "}
                          {translations.studentIdDisplay[locale]}:{" "}
                          {request.creator_student_id}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                            <span className="block text-xs text-zinc-500">
                              {translations.currentSection[locale]}
                            </span>
                            <span className="block text-white font-medium">
                              {translations.wantToSwap[locale]}{" "}
                              {request.current_section}
                            </span>
                          </div>
                          <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                            <span className="block text-xs text-zinc-500">
                              {translations.targetSection[locale]}
                            </span>
                            <span className="block text-white font-medium">
                              {translations.wantToSwap[locale]}{" "}
                              {request.target_section}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-zinc-400 space-x-4">
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {translations.postedTime[locale]}:{" "}
                            {formatRelativeTime(request.created_at)}
                          </span>
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {translations.expires[locale]}:{" "}
                            {formatExpiryDate(request.expires_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3">
                        {request.user_id === user?.id ? (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm transition-colors"
                          >
                            {translations.cancelRequest[locale]}
                          </button>
                        ) : (
                          <a
                            href={`mailto:${
                              request.creator_student_id
                            }@udst.edu.qa?subject=${encodeURIComponent(
                              `Swap Request: ${request.course_name}`
                            )}`}
                            className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm transition-colors text-center"
                          >
                            {translations.contactRequester[locale]}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
