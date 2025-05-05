import { useState } from "react";
import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Footer from "../components/ui/Footer";

type FeedbackType = "bug" | "feature" | "suggestion" | "other";

export default function Feedback() {
  const locale = useLocale();
  const [name, setName] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const timestamp = new Date().toISOString();

    // Prepare the Discord embed
    const webhookBody = {
      embeds: [
        {
          title:
            locale === "ar"
              ? "تم استلام ملاحظات جديدة!"
              : "New Feedback Received!",
          color: getFeedbackColor(feedbackType),
          fields: [
            {
              name: locale === "ar" ? "الاسم" : "Name",
              value: name || "Anonymous",
              inline: true,
            },
            {
              name: locale === "ar" ? "نوع الملاحظات" : "Feedback Type",
              value: getFeedbackTypeLabel(feedbackType),
              inline: true,
            },
            {
              name: locale === "ar" ? "الرسالة" : "Message",
              value: message,
            },
          ],
          timestamp,
          footer: {
            text: "UDST Tools Feedback System",
          },
        },
      ],
    };

    try {
      const response = await fetch(
        "https://discord.com/api/webhooks/1368796048356671549/JEz6CPH9VOVdMg6sJqyjdkunh-6wnj46PCtAK2NMYncDrst9f5F0MJZtt6hLSbKYFo8o",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookBody),
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        // Clear form
        setName("");
        setFeedbackType("suggestion");
        setMessage("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackColor = (type: FeedbackType): number => {
    switch (type) {
      case "bug":
        return 0xed4245; // Discord Red
      case "feature":
        return 0x57f287; // Discord Green
      case "suggestion":
        return 0x5865f2; // Discord Blue
      default:
        return 0xfee75c; // Discord Yellow
    }
  };

  const getFeedbackTypeLabel = (type: FeedbackType): string => {
    switch (type) {
      case "bug":
        return locale === "ar" ? "مشكلة" : "Bug Report";
      case "feature":
        return locale === "ar" ? "ميزة جديدة" : "Feature Request";
      case "suggestion":
        return locale === "ar" ? "اقتراح" : "Suggestion";
      default:
        return locale === "ar" ? "أخرى" : "Other";
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

        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{
              en: "Feedback",
              ar: "الملاحظات",
            }}
            description={{
              en: "Share your thoughts, report issues, or suggest improvements",
              ar: "شارك أفكارك، أبلغ عن المشاكل، أو اقترح تحسينات",
            }}
          />

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={locale === "ar" ? "الاسم (اختياري)" : "Name (Optional)"}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "ar" ? "أدخل اسمك" : "Enter your name"}
              />

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {locale === "ar" ? "نوع الملاحظات" : "Feedback Type"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    ["suggestion", "feature", "bug", "other"] as FeedbackType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeedbackType(type)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        feedbackType === type
                          ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50"
                          : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      {getFeedbackTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {locale === "ar" ? "رسالتك" : "Your Message"}
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    locale === "ar"
                      ? "اكتب ملاحظاتك هنا..."
                      : "Write your feedback here..."
                  }
                  className="w-full h-32 px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all ${
                    isSubmitting || !message.trim()
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {isSubmitting
                    ? locale === "ar"
                      ? "جارٍ الإرسال..."
                      : "Submitting..."
                    : locale === "ar"
                    ? "إرسال الملاحظات"
                    : "Submit Feedback"}
                </button>
              </div>

              {submitStatus !== "idle" && (
                <div
                  className={`p-4 rounded-lg ${
                    submitStatus === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {submitStatus === "success"
                    ? locale === "ar"
                      ? "تم إرسال ملاحظاتك بنجاح! شكراً لك."
                      : "Your feedback has been submitted successfully! Thank you."
                    : locale === "ar"
                    ? "عذراً، حدث خطأ أثناء إرسال ملاحظاتك. يرجى المحاولة مرة أخرى."
                    : "Sorry, there was an error submitting your feedback. Please try again."}
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
