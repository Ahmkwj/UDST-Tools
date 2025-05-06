import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";

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
    description: {
      en: "Manage your account settings and preferences",
      ar: "إدارة إعدادات وتفضيلات حسابك",
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card title={translations.profileSection[locale]}>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {profileError && (
                  <div className="p-3 text-sm text-white bg-red-500/20 border border-red-500/50 rounded-lg">
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="p-3 text-sm text-white bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                    {profileSuccess}
                  </div>
                )}

                <Input
                  label={translations.nameLabel[locale]}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label={translations.emailLabel[locale]}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="relative w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span
                    className={profileLoading ? "opacity-0" : "opacity-100"}
                  >
                    {translations.saveChanges[locale]}
                  </span>
                  {profileLoading && (
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
              </form>
            </Card>

            {/* Security */}
            <Card title={translations.securitySection[locale]}>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                {passwordError && (
                  <div className="p-3 text-sm text-white bg-red-500/20 border border-red-500/50 rounded-lg">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 text-sm text-white bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                    {passwordSuccess}
                  </div>
                )}

                <Input
                  label={translations.newPasswordLabel[locale]}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label={translations.confirmNewPasswordLabel[locale]}
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="relative w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span
                    className={passwordLoading ? "opacity-0" : "opacity-100"}
                  >
                    {translations.updatePassword[locale]}
                  </span>
                  {passwordLoading && (
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

                <div className="h-px bg-zinc-800"></div>

                <button
                  onClick={handleSignOut}
                  type="button"
                  className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                >
                  {translations.signOut[locale]}
                </button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
