import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";
import Footer from "../components/ui/Footer";
import Card from "../components/ui/Card";

const cardClass = "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";
const sectionGap = "space-y-8 sm:space-y-12";

export default function Guide() {
  const locale = useLocale();

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "User Guide",
              ar: "دليل المستخدم",
            }}
            description={{
              en: "A quick guide to help you get the most out of each tool.",
              ar: "دليل سريع لمساعدتك في الاستفادة القصوى من كل أداة.",
            }}
          />

          <div className={sectionGap}>
          {/* ── Quick Start ── */}
          <Card title={locale === "ar" ? "دليل البدء السريع" : "Quick Start"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm leading-relaxed">
                {locale === "ar"
                  ? "مرحبًا بك في أدوات UDST! هذا الدليل سيساعدك على البدء بسرعة والاستفادة القصوى من جميع الأدوات المتاحة."
                  : "Welcome to UDST Tools! This guide will help you get started quickly and make the most of all available tools."
                }
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                    {locale === "ar" ? "الخطوات الأولى" : "First Steps"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar"
                          ? "افتح أي أداة من القائمة الجانبية."
                          : "Open any tool from the sidebar."
                        }
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar"
                          ? "أدخل بياناتك مباشرة."
                          : "Enter your data directly."
                        }
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar"
                          ? "تظهر النتائج فورًا."
                          : "Results update instantly."
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                    {locale === "ar" ? "نصائح مفيدة" : "Essential Tips"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 me-3`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "تأكد من دقة البيانات المدخلة" : "Ensure accuracy of entered data"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 me-3`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "احتفظ بكشف درجاتك الرسمي كمرجع" : "Keep your official transcript as reference"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 me-3`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "استخدم الأدوات للتخطيط المسبق" : "Use tools for advance planning"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── GPA Calculator ── */}
          <Card title={locale === "ar" ? "حاسبة المعدل التراكمي" : "GPA Calculator"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "احسب معدلك التراكمي المتوقع بناءً على بيانات كشف درجاتك الحالي والدرجات المتوقعة للفصل الجديد."
                  : "Calculate your projected cumulative GPA based on your current transcript data and expected grades for the new semester."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "خطوات الاستخدام" : "How to Use"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "أدخل بيانات كشف الدرجات:"
                            : "Enter your transcript data:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• أدخل مجموع نقاط الدرجات وإجمالي الساعات المعتمدة من كشف الدرجات الرسمي\n• ستحسب الأداة معدلك الحالي تلقائيًا"
                            : "• Enter Total Grade Points and Total Credits from your official transcript\n• The tool will automatically calculate your current GPA"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "حدد عدد المواد للفصل الحالي:"
                            : "Set the number of courses for this semester:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• حدد عدد المواد للفصل الحالي\n• ستظهر الحقول تلقائيًا لكل مادة"
                            : "• Set the number of courses for this semester\n• Fields appear automatically for each course"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "أدخل بيانات كل مادة:"
                            : "Enter data for each course:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• اختر الدرجة المتوقعة (A, B+, B, C+, C, D+, D, F)\n• أدخل عدد الساعات المعتمدة (افتراضي 3 ساعات)\n• لإعادة المواد: حدد 'أقوم بإعادة هذه المادة' واختر الدرجة السابقة"
                            : "• Select expected grade (A, B+, B, C+, C, D+, D, F)\n• Enter credit hours (default 3 hours)\n• For retakes: check 'Repeating this course' and select previous grade"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>4.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "شاهد النتائج:"
                            : "View Results:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• معدلك الحالي والمتوقع يُحسبان فوريًا\n• سيناريوهات متعددة بعدد مواد مختلف\n• إحصائيات تفصيلية للمعدل والساعات"
                            : "• Current and projected GPA calculated instantly\n• Multiple scenarios with different course counts\n• Detailed GPA and credit statistics"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-blue-400/90 pt-2 border-t border-zinc-600/40">
                  {locale === "ar"
                    ? "نقاط الدرجات والساعات من كشف الدرجات الرسمي. عند إعادة المواد تُطرح القديمة وتُضاف الجديدة. تحقق من النتائج مع المرشد."
                    : "Grade points and credits are on your official transcript. For retakes, old points are subtracted and new ones added. Verify results with your advisor."
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* ── Grade Calculator ── */}
          <Card title={locale === "ar" ? "حاسبة الدرجات" : "Grade Calculator"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "احسب درجتك النهائية المتوقعة في أي مادة بناءً على أوزان التقييمات ودرجاتك المحققة. تتحدث الحسابات فوريًا عند إدخال الدرجات."
                  : "Calculate your expected final grade in any course based on assessment weights and your achieved scores. Calculations update instantly as you enter grades."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "خطوات الاستخدام" : "How to Use"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "إضافة التقييمات:"
                            : "Adding Assessments:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• انقر على 'إضافة تقييم' لإضافة كل تقييم في المادة\n• الأداة تقترح أسماء افتراضية (الاختبار النهائي، اللابات، الاختبار النصفي، الكويزات، المشروع)\n• يمكنك تعديل الاسم لأي تقييم"
                            : "• Click 'Add Assignment' to add each course assessment\n• Tool suggests default names (Final, Laboratory, Midterm, Quiz, Project)\n• You can edit the name of any assessment"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "تحديد الأوزان والدرجات:"
                            : "Setting Weights and Scores:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• أدخل وزن كل تقييم كنسبة مئوية (مثل: 40% للامتحان النهائي)\n• أدخل درجتك عند الحصول عليها (من 0 إلى 100)\n• اتركها فارغة إذا لم تحصل على الدرجة بعد"
                            : "• Enter weight of each assessment as percentage (e.g., 40% for final exam)\n• Enter your score when you receive it (0 to 100)\n• Leave blank if you haven't received the grade yet"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "فهم النتائج:"
                            : "Understanding Results:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• الوضع الحالي: بناءً على التقييمات المكتملة فقط\n• الدرجة المتوقعة: إذا حصلت على 0% في التقييمات المتبقية\n• جدول الدرجات مع النقاط وتفصيل التقدم"
                            : "• Current Standing: Based only on completed assessments\n• Projected Grade: If you score 0% on remaining assessments\n• Grade scale with points and progress breakdown"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-600/40">
                  {locale === "ar"
                    ? "مجموع الأوزان يجب أن يساوي 100%. التوزيع من منهج المادة أو الأستاذ."
                    : "Total weight must equal 100%. Find distribution in syllabus or from your professor."
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* ── Attendance Calculator ── */}
          <Card title={locale === "ar" ? "حاسبة الحضور" : "Attendance Calculator"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "احسب نسبة غيابك الحالية والمتوقعة لتجنب تجاوز الحد المسموح (15%) وتفادي المشاكل الأكاديمية. يحسب بالدقائق للدقة."
                  : "Calculate your current and projected absence percentage to avoid exceeding the allowed limit (15%) and avoid academic issues. Calculates by minutes for accuracy."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "خطوات الاستخدام" : "How to Use"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "إعداد معلومات الفصل:"
                            : "Semester Setup:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• أدخل نسبة الغياب الحالية من نظام الطلاب (0 إذا لم تتغيب)\n• حدد عدد أسابيع الفصل (14 للفصل العادي، 6 للفصل الصيفي)\n• اختر عدد المحاضرات في الأسبوع (0-6)"
                            : "• Enter current absence percentage from student system (0 if never absent)\n• Set semester weeks (14 for regular semester, 6 for summer)\n• Choose number of classes per week (0-6)"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "إضافة المحاضرات:"
                            : "Adding Classes:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• لكل محاضرة، اختر المدة (30 دقيقة، ساعة، 1.5 ساعة، ساعتان، 2.5 ساعة، 3 ساعات)\n• حدد عدد مرات الغياب المخطط لها (0-6 مرات أو خيار مخصص)\n• يمكن إدخال دقائق مخصصة للغياب"
                            : "• For each class, select duration (30 minutes, 1 hour, 1.5 hours, 2 hours, 2.5 hours, 3 hours)\n• Set planned number of absences (0-6 times or custom option)\n• Can enter custom minutes for absences"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "مراقبة النتائج:"
                            : "Monitoring Results:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• شاهد نسبة الغياب المحدّثة فوريًا\n• تحقق من عدد المحاضرات المتبقية المسموح بتفويتها\n• تحذيرات ملونة عند الاقتراب من الحد (15%)"
                            : "• View updated absence percentage instantly\n• Check remaining classes allowed to miss\n• Color-coded warnings when approaching limit (15%)"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── Academic Calendar ── */}
          <Card title={locale === "ar" ? "التقويم الأكاديمي" : "Academic Calendar"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "تصفح جميع المواعيد المهمة والأحداث الأكاديمية للسنة الدراسية بتصنيفات ملونة وأوصاف تفصيلية."
                  : "Browse all important dates and academic events for the academic year with color-coded categories and detailed descriptions."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "كيفية الاستخدام" : "How to Use"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "اختيار الفترة الزمنية:"
                            : "Selecting Time Period:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• اختر السنة الأكاديمية من القائمة المنسدلة (مثل: 2024/2025)\n• حدد الفصل الدراسي (الخريف، الشتاء، الربيع)"
                            : "• Select academic year from dropdown (e.g., 2024/2025)\n• Choose semester (Fall, Winter, Spring)"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "فهم أنواع المواعيد:"
                            : "Understanding Date Types:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• العطل (أخضر): العيد الوطني، العيد الرياضي، رمضان، عيد الفطر، عيد الأضحى\n• الامتحانات (أحمر): فترات الامتحانات النصفية والنهائية\n• التسجيل (أزرق): فتح التسجيل، فترة الحذف والإضافة\n• المواعيد النهائية (برتقالي): آخر موعد للتسجيل، الانسحاب، حذف المواد\n• أكاديمي (رمادي): بداية/نهاية الفصل، إصدار الدرجات، الاستئناف"
                            : "• Holidays (Green): National Day, Sports Day, Ramadan, Eid Al-Fitr, Eid Al-Adha\n• Exams (Red): Midterm and final exam periods\n• Registration (Blue): Registration opens, add/drop period\n• Deadlines (Orange): Last day to register, withdraw, drop courses\n• Academic (Gray): Start/end of term, grades release, appeals"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "التخطيط باستخدام التقويم:"
                            : "Planning with Calendar:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• استخدم المواعيد لتنظيم دراستك وخططك الشخصية\n• انتبه للمواعيد النهائية المهمة لتجنب تفويتها\n• خطط للعطل والإجازات الرسمية"
                            : "• Use dates to organize your studies and personal plans\n• Pay attention to important deadlines to avoid missing them\n• Plan for holidays and official breaks"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── Schedule Planner ── */}
          <Card title={locale === "ar" ? "مخطط الجدول" : "Schedule Planner"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "أنشئ جدولك الدراسي الأسبوعي وتحقق من التعارضات بين مواعيد المحاضرات فوريًا. مصمم لحل مشاكل التسجيل في PeopleSoft."
                  : "Create your weekly class schedule and check for time conflicts between lectures instantly. Designed to solve PeopleSoft registration problems."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "خطوات إنشاء الجدول" : "Schedule Creation Steps"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "إضافة المواد:"
                            : "Adding Courses:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• انقر على 'إضافة مادة' لكل مادة تريد تسجيلها\n• أدخل اسم المادة (يمكن تعديله لاحقًا)\n• يمكنك حذف المواد بالنقر على أيقونة الحذف"
                            : "• Click 'Add Course' for each course you want to register\n• Enter course name (can edit later)\n• You can delete courses by clicking the delete icon"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "تحديد مواعيد المحاضرات:"
                            : "Setting Lecture Times:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• لكل مادة، انقر على 'إضافة موعد' لإضافة وقت المحاضرة\n• اختر يوم المحاضرة (الأحد إلى الخميس)\n• حدد وقت البداية والنهاية (من 8:00 ص إلى 11:30 م)\n• يمكنك إضافة عدة مواعيد لنفس المادة"
                            : "• For each course, click 'Add Time Slot' to add lecture time\n• Select lecture day (Sunday to Thursday)\n• Set start and end time (8:00 AM to 11:30 PM)\n• You can add multiple time slots for same course"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "كشف التعارضات:"
                            : "Conflict Detection:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• الأداة تفحص التعارضات تلقائيًا وفوريًا\n• ستظهر التعارضات في اللوحة اليمنى مع التفاصيل\n• يُظهر اسم المادتين والأوقات المتعارضة واليوم"
                            : "• Tool automatically checks conflicts instantly\n• Conflicts appear in right panel with details\n• Shows conflicting course names, times, and day"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>4.</span>
                      <div className="text-zinc-400 text-sm">
                        <div className="font-medium mb-1 text-zinc-300">
                          {locale === "ar"
                            ? "حل التعارضات:"
                            : "Resolving Conflicts:"
                          }
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {locale === "ar"
                            ? "• عدّل أوقات المحاضرات حتى تختفي جميع التعارضات\n• أو احذف إحدى المحاضرات المتعارضة\n• بمجرد حل التعارضات، يمكنك التسجيل بثقة في PeopleSoft"
                            : "• Modify lecture times until all conflicts disappear\n• Or delete one of the conflicting lectures\n• Once conflicts are resolved, you can register confidently in PeopleSoft"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── Ramadan Schedule ── */}
          <Card title={locale === "ar" ? "جدول رمضان" : "Ramadan Schedule"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "الصق جدول تسجيلك من PeopleSoft وحوّل أوقات الحصص إلى توقيت رمضان. احفظ النتيجة كصورة بحجم الهاتف."
                  : "Paste your enrollment schedule from PeopleSoft and convert class times to Ramadan hours. Save the result as a phone-sized image."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "خطوات الاستخدام" : "How to Use"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "انسخ الجدول من PeopleSoft:"
                            : "Copy schedule from PeopleSoft:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• اذهب إلى PeopleSoft ثم Manage Classes ثم View My Classes ثم Printable Page"
                            : "• Go to PeopleSoft > Manage Classes > View My Classes > Printable Page"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "الصق المحتوى:"
                            : "Paste the content:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• انسخ كل محتوى الصفحة والصقه في مربع النص"
                            : "• Copy the entire content of the page and paste it in the text box"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "حوّل الجدول:"
                            : "Convert the schedule:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• اضغط حوّل الجدول. ستُعرض حصصك مجمّعة حسب اليوم مع أوقات رمضان الجديدة"
                            : "• Click Convert Schedule. Your classes will be grouped by day with new Ramadan times"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>4.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "حمّل الصورة:"
                            : "Download the image:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• اضغط تحميل الصورة لحفظ جدولك المحوّل كصورة بحجم الهاتف"
                            : "• Click Download Image to save a phone-sized PNG of your converted schedule"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── Fees Manager ── */}
          <Card title={locale === "ar" ? "إدارة الرسوم" : "Fees Manager"} className={cardClass}>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                {locale === "ar"
                  ? "قدّر الرسوم الدراسية بناءً على برنامجك ونوع الطالب وعدد المواد."
                  : "Estimate tuition and fees based on your program, student status, and course load."
                }
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-4">
                    {locale === "ar" ? "خطوات الاستخدام" : "How to Use"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>1.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "اختر البرنامج ونوع الطالب:"
                            : "Select program and student status:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• اختر برنامجك ونوع الطالب (جديد، مستمر، قطري، إلخ)"
                            : "• Select your program and student status (new, continuing, Qatari, etc.)"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>2.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "أضف المواد والساعات:"
                            : "Add courses and credits:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• أضف موادك وساعاتها المعتمدة للفصل"
                            : "• Add your courses and credit hours for the semester"
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 me-3`}>3.</span>
                      <div className="text-zinc-300 text-sm">
                        <div className="font-medium mb-1">
                          {locale === "ar"
                            ? "استعرض التكاليف:"
                            : "View cost breakdown:"
                          }
                        </div>
                        <div className="text-zinc-400 text-xs">
                          {locale === "ar"
                            ? "• استعرض تفصيل الرسوم والتكاليف الإجمالية المقدّرة"
                            : "• View the estimated breakdown of tuition, fees, and total cost"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
