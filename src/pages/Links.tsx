import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { useLocale } from "../context/LanguageContext";
import Footer from "../components/ui/Footer";

/* Theme: match Attendance / GPA / Calendar */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const sectionGap = "space-y-12";

interface LinkCategory {
  title: {
    en: string;
    ar: string;
  };
  links: {
    title: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
    url: string;
    icon: React.ReactNode;
  }[];
}

export default function Links() {
  const locale = useLocale();

  const categories: LinkCategory[] = [
    {
      title: {
        en: "Learning Management",
        ar: "إدارة التعلم",
      },
      links: [
        {
          title: {
            en: "D2L (Brightspace)",
            ar: "D2L (برايتسبيس)",
          },
          description: {
            en: "Access your courses, assignments, and learning materials through UDST's Learning Management System.",
            ar: "الوصول إلى المواد والواجبات والمواد التعليمية من خلال نظام إدارة التعلم.",
          },
          url: "https://d2l.udst.edu.qa/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          ),
        },
        {
          title: {
            en: "Navigate360",
            ar: "نافيجيت360",
          },
          description: {
            en: "Your digital one-stop shop for student success. Schedule appointments, view events, and access resources.",
            ar: "وجهتك الشاملة للنجاح الأكاديمي. جدولة المواعيد، عرض الفعاليات، والوصول إلى الموارد.",
          },
          url: "https://www.udst.edu.qa/navigate-360",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: {
        en: "Student Services",
        ar: "الخدمات الطلابية",
      },
      links: [
        {
          title: {
            en: "MyUDST",
            ar: "بوابتي",
          },
          description: {
            en: "Access UDST's Intranet system for student resources and information.",
            ar: "الوصول إلى نظام الإنترانت للموارد والمعلومات الطلابية.",
          },
          url: "https://access.udst.edu.qa/myudst",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          ),
        },
        {
          title: {
            en: "PeopleSoft",
            ar: "بيبول سوفت",
          },
          description: {
            en: "Access your Student Information System for biographical details and academic information.",
            ar: "الوصول إلى نظام معلومات الطلاب للتفاصيل الشخصية والمعلومات الأكاديمية.",
          },
          url: "https://campus.udst.edu.qa/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: {
        en: "Communication & Storage",
        ar: "التواصل والتخزين",
      },
      links: [
        {
          title: {
            en: "Student Email",
            ar: "البريد الإلكتروني",
          },
          description: {
            en: "Access your UDST email through Outlook Web App.",
            ar: "الوصول إلى بريدك الإلكتروني عبر تطبيق Outlook.",
          },
          url: "https://outlook.office.com/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          ),
        },
        {
          title: {
            en: "OneDrive",
            ar: "ون درايف",
          },
          description: {
            en: "Access your cloud storage and Office 365 apps.",
            ar: "الوصول إلى التخزين السحابي وتطبيقات Office 365.",
          },
          url: "https://www.office.com/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: {
        en: "Support Services",
        ar: "خدمات الدعم",
      },
      links: [
        {
          title: {
            en: "Password Reset",
            ar: "إعادة تعيين كلمة المرور",
          },
          description: {
            en: "Reset your password or get help with login issues.",
            ar: "إعادة تعيين كلمة المرور أو الحصول على المساعدة في مشاكل تسجيل الدخول.",
          },
          url: "https://password.udst.edu.qa/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
          ),
        },
        {
          title: {
            en: "Facility Requests",
            ar: "طلبات المرافق",
          },
          description: {
            en: "Submit and track facilities service requests through FAMIS.",
            ar: "تقديم وتتبع طلبات خدمات المرافق من خلال نظام FAMIS.",
          },
          url: "https://famis.udst.edu.qa/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: {
        en: "Campus Services",
        ar: "الخدمات الجامعية",
      },
      links: [
        {
          title: {
            en: "Sport & Wellness",
            ar: "الرياضة واللياقة",
          },
          description: {
            en: "Book sports facilities, gym sessions, and wellness activities. Access using your UDST credentials.",
            ar: "احجز المرافق الرياضية، وحصص الجيم، وأنشطة اللياقة. الدخول باستخدام بيانات اعتماد UDST.",
          },
          url: "https://udstsport.udst.edu.qa/",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
          ),
        },
        {
          title: {
            en: "Library",
            ar: "المكتبة",
          },
          description: {
            en: "Book study rooms, access digital resources, and browse the library catalog. Available for all UDST students.",
            ar: "احجز غرف الدراسة، واستخدم الموارد الرقمية، وتصفح فهرس المكتبة. متاح لجميع طلاب UDST.",
          },
          url: "https://library.udst.edu.qa/main/study",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <div className="page-container">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "UDST Links",
              ar: "روابط UDST",
            }}
            description={{
              en: "Quick access to UDST services and resources.",
              ar: "وصول سريع لخدمات وموارد UDST.",
            }}
          />

          <div className={sectionGap}>
            {categories.map((category, index) => (
              <Card
                key={index}
                title={locale === "ar" ? category.title.ar : category.title.en}
                className={cardClass}
              >
                <div className="space-y-0">
                  {category.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-start gap-4 py-4 ${linkIndex > 0 ? "border-t border-zinc-600/25" : ""} transition-colors hover:opacity-90`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400">
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white flex items-center gap-2">
                          {locale === "ar" ? link.title.ar : link.title.en}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        </p>
                        <p className="text-sm text-zinc-500 mt-0.5 line-clamp-2">
                          {locale === "ar" ? link.description.ar : link.description.en}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>
            ))}

            <Card
              title={locale === "ar" ? "المساعدة" : "Need Help?"}
              className={cardClass}
            >
              <p className="text-sm text-zinc-400">
                {locale === "ar"
                  ? "للدعم الفني: "
                  : "Technical support: "}
                <a
                  href="mailto:ithelpdesk@udst.edu.qa"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ithelpdesk@udst.edu.qa
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
