import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";

export default function Profile() {
  const { user, signOut, updateProfile, updatePassword } = useAuth();
  const locale = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const translations = {
    title: {
      en: "Profile",
      ar: "الملف الشخصي",
    },
    nameLabel: {
      en: "Full Name",
      ar: "الاسم الكامل",
    },
    emailLabel: {
      en: "Email",
      ar: "البريد الإلكتروني",
    },
    saveChanges: {
      en: "Save Changes",
      ar: "حفظ التغييرات",
    },
    changesSaved: {
      en: "Your changes have been saved",
      ar: "تم حفظ التغييرات",
    },
    newPasswordLabel: {
      en: "New Password",
      ar: "كلمة المرور الجديدة",
    },
    confirmNewPasswordLabel: {
      en: "Confirm New Password",
      ar: "تأكيد كلمة المرور الجديدة",
    },
    updatePassword: {
      en: "Update Password",
      ar: "تحديث كلمة المرور",
    },
    passwordUpdated: {
      en: "Your password has been updated",
      ar: "تم تحديث كلمة المرور",
    },
    signOut: {
      en: "Sign Out",
      ar: "تسجيل الخروج",
    },
    profileSection: {
      en: "Profile Information",
      ar: "معلومات الملف الشخصي",
    },
    securitySection: {
      en: "Security",
      ar: "الأمان",
    },
    passwordsNoMatch: {
      en: "New passwords do not match",
      ar: "كلمات المرور الجديدة غير متطابقة",
    },
    weakPassword: {
      en: "Password must be at least 6 characters",
      ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    },
    genericError: {
      en: "An error occurred",
      ar: "حدث خطأ",
    },
  };

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileLoading(true);

    try {
      const { error } = await updateProfile({ name, email });

      if (error) {
        setProfileError(translations.genericError[locale]);
      } else {
        setProfileSuccess(translations.changesSaved[locale]);
      }
    } catch (err) {
      setProfileError(translations.genericError[locale]);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validation
    if (newPassword !== confirmNewPassword) {
      setPasswordError(translations.passwordsNoMatch[locale]);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(translations.weakPassword[locale]);
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await updatePassword(newPassword);

      if (error) {
        setPasswordError(translations.genericError[locale]);
      } else {
        setPasswordSuccess(translations.passwordUpdated[locale]);
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      setPasswordError(translations.genericError[locale]);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-white">
        {translations.title[locale]}
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Profile Information */}
        <div className="p-6 bg-zinc-800 rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {translations.profileSection[locale]}
          </h2>

          <form onSubmit={handleProfileUpdate}>
            {profileError && (
              <div className="p-3 mb-4 text-sm text-white bg-red-500 rounded">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="p-3 mb-4 text-sm text-white bg-green-500 rounded">
                {profileSuccess}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-zinc-300"
              >
                {translations.nameLabel[locale]}
              </label>
              <input
                id="name"
                type="text"
                className="block w-full px-3 py-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-zinc-300"
              >
                {translations.emailLabel[locale]}
              </label>
              <input
                id="email"
                type="email"
                className="block w-full px-3 py-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {profileLoading ? (
                <span className="flex items-center justify-center">
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
                  {translations.saveChanges[locale]}
                </span>
              ) : (
                translations.saveChanges[locale]
              )}
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="p-6 bg-zinc-800 rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {translations.securitySection[locale]}
          </h2>

          <form onSubmit={handlePasswordUpdate} className="mb-6">
            {passwordError && (
              <div className="p-3 mb-4 text-sm text-white bg-red-500 rounded">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 mb-4 text-sm text-white bg-green-500 rounded">
                {passwordSuccess}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium text-zinc-300"
              >
                {translations.newPasswordLabel[locale]}
              </label>
              <input
                id="newPassword"
                type="password"
                className="block w-full px-3 py-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmNewPassword"
                className="block mb-2 text-sm font-medium text-zinc-300"
              >
                {translations.confirmNewPasswordLabel[locale]}
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                className="block w-full px-3 py-2 text-white bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {passwordLoading ? (
                <span className="flex items-center justify-center">
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
                  {translations.updatePassword[locale]}
                </span>
              ) : (
                translations.updatePassword[locale]
              )}
            </button>
          </form>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {translations.signOut[locale]}
          </button>
        </div>
      </div>
    </div>
  );
}
