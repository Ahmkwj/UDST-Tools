import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    confirmPasswordLabel: {
      en: "Confirm Password",
      ar: "تأكيد كلمة المرور",
    },
    signupButton: {
      en: "Sign Up",
      ar: "إنشاء حساب",
    },
    haveAccount: {
      en: "Already have an account?",
      ar: "لديك حساب بالفعل؟",
    },
    loginLink: {
      en: "Log In",
      ar: "تسجيل الدخول",
    },
    passwordsNoMatch: {
      en: "Passwords do not match",
      ar: "كلمات المرور غير متطابقة",
    },
    weakPassword: {
      en: "Password must be at least 6 characters",
      ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    },
    invalidEmail: {
      en: "Please enter a valid email address",
      ar: "يرجى إدخال عنوان بريد إلكتروني صالح",
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

    // Validation
    if (password !== confirmPassword) {
      setError(translations.passwordsNoMatch[locale]);
      return;
    }

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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-zinc-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {translations.title[locale]}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-white bg-red-500 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-300"
            >
              {translations.nameLabel[locale]}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="block w-full px-3 py-2 mt-1 text-white placeholder-zinc-500 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-300"
            >
              {translations.emailLabel[locale]}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full px-3 py-2 mt-1 text-white placeholder-zinc-500 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300"
            >
              {translations.passwordLabel[locale]}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-3 py-2 mt-1 text-white placeholder-zinc-500 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-300"
            >
              {translations.confirmPasswordLabel[locale]}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="block w-full px-3 py-2 mt-1 text-white placeholder-zinc-500 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
                  {translations.signupButton[locale]}
                </span>
              ) : (
                translations.signupButton[locale]
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-zinc-400">
            {translations.haveAccount[locale]}{" "}
            <Link
              to={`/${locale}/login`}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              {translations.loginLink[locale]}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
