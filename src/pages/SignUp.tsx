import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const locale = useLocale();

  const translations = {
    title: {
      en: "Create Account",
      ar: "إنشاء حساب",
    },
    description: {
      en: "Join UDST Tools to access all features",
      ar: "انضم إلى UDST Tools للوصول إلى جميع الميزات",
    },
    nameLabel: {
      en: "Full Name",
      ar: "الاسم الكامل",
    },
    emailLabel: {
      en: "Email",
      ar: "البريد الإلكتروني",
    },
    passwordLabel: {
      en: "Password",
      ar: "كلمة المرور",
    },
    signupButton: {
      en: "Create Account",
      ar: "إنشاء حساب",
    },
    haveAccount: {
      en: "Already have an account?",
      ar: "لديك حساب بالفعل؟",
    },
    loginLink: {
      en: "Sign In",
      ar: "تسجيل الدخول",
    },
    weakPassword: {
      en: "Password must be at least 6 characters",
      ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    },
    emailExists: {
      en: "Email already in use",
      ar: "البريد الإلكتروني قيد الاستخدام بالفعل",
    },
    genericError: {
      en: "Error creating account",
      ar: "خطأ في إنشاء الحساب",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(translations.weakPassword[locale]);
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, name);

      if (error) {
        if (error.message.includes("email")) {
          setError(translations.emailExists[locale]);
        } else {
          setError(translations.genericError[locale]);
        }
      } else {
        // Redirect to login page with success message
        navigate(`/${locale}/login`);
      }
    } catch (err) {
      setError(translations.genericError[locale]);
    } finally {
      setLoading(false);
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

        <div className="relative z-10 w-full max-w-md mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
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

          <Card>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 text-sm text-white bg-red-500/20 border border-red-500/50 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label={translations.nameLabel[locale]}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label={translations.emailLabel[locale]}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label={translations.passwordLabel[locale]}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="relative w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={loading ? "opacity-0" : "opacity-100"}>
                  {translations.signupButton[locale]}
                </span>
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white animate-spin"
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
                  </span>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-zinc-400">
                  {translations.haveAccount[locale]}{" "}
                  <Link
                    to={`/${locale}/login`}
                    className="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200"
                  >
                    {translations.loginLink[locale]}
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
