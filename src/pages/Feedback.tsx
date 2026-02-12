import { useState } from "react";
import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Footer from "../components/ui/Footer";

const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const sectionGap = "space-y-12";
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:py-2.5 [&_select]:py-2.5";

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
    <div className="min-h-screen w-full flex flex-col text-white">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8">
        <div className={`max-w-2xl mx-auto ${sectionGap}`}>
          <PageHeader
            title={{ en: "Feedback", ar: "الملاحظات" }}
            description={{
              en: "Share thoughts, report issues, or suggest improvements",
              ar: "شارك أفكارك، أبلغ عن مشكلة، أو اقترح تحسينات",
            }}
          />

          <Card title={locale === "ar" ? "إرسال ملاحظات" : "Send Feedback"} className={cardClass}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={locale === "ar" ? "الاسم (اختياري)" : "Name (Optional)"}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "ar" ? "أدخل اسمك" : "Enter your name"}
                className={inputSelectClass}
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
                      className={`p-2.5 rounded-xl text-sm font-medium transition-all ${
                        feedbackType === type
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                          : "bg-zinc-800/50 border border-zinc-600/40 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
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
                  className="w-full h-32 px-3 py-2.5 bg-zinc-800/50 border border-zinc-500/40 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all ${
                  isSubmitting || !message.trim()
                    ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
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

              {submitStatus !== "idle" && (
                <p
                  className={`text-sm pt-2 border-t border-zinc-600/40 ${
                    submitStatus === "success"
                      ? "text-zinc-400"
                      : "text-red-400/90"
                  }`}
                >
                  {submitStatus === "success"
                    ? locale === "ar"
                      ? "تم إرسال ملاحظاتك بنجاح. شكراً لك."
                      : "Your feedback was submitted successfully. Thank you."
                    : locale === "ar"
                    ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
                    : "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
