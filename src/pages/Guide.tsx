import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";
import Footer from "../components/ui/Footer";
import Card from "../components/ui/Card";

export default function Guide() {
  const locale = useLocale();

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Header section */}
          <PageHeader
            title={{
              en: "User Guide",
              ar: "دليل المستخدم",
            }}
            description={{
              en: "Learn how to use each feature of UDST Tools effectively",
              ar: "تعلم كيفية استخدام كل ميزة من أدوات UDST بفعالية",
            }}
          />

          {/* GPA Calculator Guide */}
          <Card
            title={locale === "ar" ? "حاسبة المعدل التراكمي" : "GPA Calculator"}
          >
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium text-white mb-4">
                  {locale === "ar" ? "كيفية الاستخدام" : "How to Use"}
                </h3>
                <ol className="list-decimal list-inside space-y-4 text-zinc-300">
                  {locale === "ar" ? (
                    <>
                      <li>أدخل مجموع نقاط الدرجات الحالية من كشف الدرجات.</li>
                      <li>أدخل إجمالي الساعات المكتسبة من كشف الدرجات.</li>
                      <li>اختر عدد المواد التي تدرسها هذا الفصل.</li>
                      <li>
                        لكل مادة:
                        <ul className="list-disc list-inside mt-2 mr-6 text-zinc-400">
                          <li>اختر الدرجة المتوقعة (A, B+, B, إلخ)</li>
                          <li>أدخل عدد الساعات المعتمدة للمادة</li>
                          <li>
                            إذا كنت تعيد المادة، حدد خيار "أقوم بإعادة هذه
                            المادة" واختر درجتك السابقة
                          </li>
                        </ul>
                      </li>
                      <li>سيتم عرض معدلك التراكمي الجديد المتوقع تلقائيًا</li>
                    </>
                  ) : (
                    <>
                      <li>
                        Enter your current total grade points from your
                        transcript.
                      </li>
                      <li>
                        Enter your total earned credits from your transcript.
                      </li>
                      <li>
                        Select the number of courses you're taking this
                        semester.
                      </li>
                      <li>
                        For each course:
                        <ul className="list-disc list-inside mt-2 ml-6 text-zinc-400">
                          <li>Choose the expected grade (A, B+, B, etc.)</li>
                          <li>Enter the course credit hours</li>
                          <li>
                            If retaking, check "Repeating this course" and
                            select your previous grade
                          </li>
                        </ul>
                      </li>
                      <li>
                        Your new projected GPA will be calculated automatically
                      </li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </Card>

          {/* Grade Calculator Guide */}
          <Card title={locale === "ar" ? "حاسبة الدرجات" : "Grade Calculator"}>
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium text-white mb-4">
                  {locale === "ar" ? "كيفية الاستخدام" : "How to Use"}
                </h3>
                <ol className="list-decimal list-inside space-y-4 text-zinc-300">
                  {locale === "ar" ? (
                    <>
                      <li>انقر على "إضافة تقييم" لإضافة كل تقييم في المادة.</li>
                      <li>
                        لكل تقييم:
                        <ul className="list-disc list-inside mt-2 mr-6 text-zinc-400">
                          <li>أدخل اسم التقييم (مثل: اختبار نصفي، واجب)</li>
                          <li>أدخل وزن التقييم من إجمالي الدرجة</li>
                          <li>أدخل درجتك إذا كنت قد حصلت عليها</li>
                        </ul>
                      </li>
                      <li>سترى درجتك الحالية والدرجة المتوقعة تلقائيًا</li>
                      <li>يمكنك حذف أو تعديل التقييمات في أي وقت</li>
                    </>
                  ) : (
                    <>
                      <li>
                        Click "Add Assignment" to add each course assessment.
                      </li>
                      <li>
                        For each assessment:
                        <ul className="list-disc list-inside mt-2 ml-6 text-zinc-400">
                          <li>
                            Enter the assessment name (e.g., Midterm,
                            Assignment)
                          </li>
                          <li>Enter its weight of the total grade</li>
                          <li>Enter your score if you've received it</li>
                        </ul>
                      </li>
                      <li>
                        Your current and projected grades will be shown
                        automatically
                      </li>
                      <li>You can delete or modify assessments at any time</li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </Card>

          {/* Attendance Calculator Guide */}
          <Card
            title={locale === "ar" ? "حاسبة الحضور" : "Attendance Calculator"}
          >
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium text-white mb-4">
                  {locale === "ar" ? "كيفية الاستخدام" : "How to Use"}
                </h3>
                <ol className="list-decimal list-inside space-y-4 text-zinc-300">
                  {locale === "ar" ? (
                    <>
                      <li>أدخل نسبة الغياب الحالية (0 إذا لم تتغيب من قبل).</li>
                      <li>
                        حدد عدد الأسابيع في الفصل الدراسي (14 للفصل العادي، 6
                        للصيفي).
                      </li>
                      <li>اختر عدد المحاضرات في الأسبوع.</li>
                      <li>
                        لكل محاضرة:
                        <ul className="list-disc list-inside mt-2 mr-6 text-zinc-400">
                          <li>حدد مدة المحاضرة</li>
                          <li>أدخل عدد مرات الغياب المخطط لها</li>
                        </ul>
                      </li>
                      <li>
                        ستظهر نسبة الغياب الجديدة وعدد المحاضرات المتبقية
                        المسموح بها
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        Enter your current absenteeism percentage (0 if never
                        absent).
                      </li>
                      <li>
                        Set the number of weeks in the semester (14 for regular,
                        6 for summer).
                      </li>
                      <li>Choose the number of classes per week.</li>
                      <li>
                        For each class:
                        <ul className="list-disc list-inside mt-2 ml-6 text-zinc-400">
                          <li>Select the class duration</li>
                          <li>Enter how many times you plan to miss it</li>
                        </ul>
                      </li>
                      <li>
                        Your new absence percentage and remaining allowed
                        absences will be shown
                      </li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </Card>

          {/* Academic Calendar Guide */}
          <Card
            title={locale === "ar" ? "التقويم الأكاديمي" : "Academic Calendar"}
          >
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium text-white mb-4">
                  {locale === "ar" ? "كيفية الاستخدام" : "How to Use"}
                </h3>
                <ol className="list-decimal list-inside space-y-4 text-zinc-300">
                  {locale === "ar" ? (
                    <>
                      <li>اختر السنة الأكاديمية من القائمة المنسدلة.</li>
                      <li>اختر الفصل الدراسي المطلوب.</li>
                      <li>
                        استعرض المواعيد المهمة المصنفة حسب:
                        <ul className="list-disc list-inside mt-2 mr-6 text-zinc-400">
                          <li>العطل (باللون الأخضر)</li>
                          <li>الاختبارات (باللون الأحمر)</li>
                          <li>التسجيل (باللون الأزرق)</li>
                          <li>المواعيد النهائية (باللون البرتقالي)</li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>Select the academic year from the dropdown.</li>
                      <li>Choose the desired semester.</li>
                      <li>
                        Browse important dates categorized by:
                        <ul className="list-disc list-inside mt-2 ml-6 text-zinc-400">
                          <li>Holidays (in green)</li>
                          <li>Exams (in red)</li>
                          <li>Registration (in blue)</li>
                          <li>Deadlines (in orange)</li>
                        </ul>
                      </li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
