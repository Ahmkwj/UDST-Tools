import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();

  // Get the path to redirect to after login
  const from = location.state?.from?.pathname || `/${locale}`;

  const translations = {
    title: {
      en: "Log In",
      ar: "تسجيل الدخول",
    },
    emailLabel: {
      en: "Email",
      ar: "البريد الإلكتروني",
    },
    passwordLabel: {
      en: "Password",
      ar: "كلمة المرور",
    },
    loginButton: {
      en: "Log In",
      ar: "تسجيل الدخول",
    },
    noAccount: {
      en: "Don't have an account?",
      ar: "ليس لديك حساب؟",
    },
    signupLink: {
      en: "Sign Up",
      ar: "إنشاء حساب",
    },
    invalidCredentials: {
      en: "Invalid email or password",
      ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(translations.invalidCredentials[locale]);
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(translations.invalidCredentials[locale]);
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
                  {translations.loginButton[locale]}
                </span>
              ) : (
                translations.loginButton[locale]
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-zinc-400">
            {translations.noAccount[locale]}{" "}
            <Link
              to={`/${locale}/signup`}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              {translations.signupLink[locale]}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
