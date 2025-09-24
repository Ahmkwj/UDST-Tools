import PageHeader from "../components/ui/PageHeader";
import Footer from "../components/ui/Footer";
import { useLocale } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { practicumGroupService } from "../services/practicumGroupService";
import { PracticumGroup, PracticumGroupFormData, PaginatedResponse } from "../types/database";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";

const SEMESTER_OPTIONS = [
  "Fall 2025",
  "Winter 2026",
  "Spring 2026",
  "Fall 2026",
  "Winter 2027",
  "Spring 2027",
  "Fall 2027",
  "Winter 2028",
  "Spring 2028",
  "Fall 2028",
  "Winter 2029",
];

const MAJORS = [
  "Data and Cyber Security",
  "Data Science and Artificial Intelligence",
  "Information Systems",
  "Information Technology",
  "Software Engineering",
];

export default function PracticumGroups() {
  const locale = useLocale();
  const { user } = useAuth();

  const [form, setForm] = useState<PracticumGroupFormData>({
    title: "",
    description: "",
    tags: [],
    notes: "",
    semester: SEMESTER_OPTIONS[0],
    publisherStudentId: "",
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string; publisherStudentId?: string; tags?: string; semester?: string; customTag?: string }>({});
  const [customTag, setCustomTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [groups, setGroups] = useState<PracticumGroup[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingList, setLoadingList] = useState(false);

  const t = useMemo(() => ({
    title: { en: "Practicum Groups", ar: "مجموعات التدريب العملي" },
    desc: {
      en: "Find members for your practicum group",
      ar: "اعثر على أعضاء لمجموعتك لمشروع التخرج",
    },
    formHead: { en: "Create or Manage Request", ar: "إنشاء أو إدارة طلب" },
    groupTitle: { en: "Group Title", ar: "اسم المجموعة" },
    description: { en: "Project Idea", ar: "فكرة المشروع" },
    tags: { en: "Majors Needed", ar: "التخصصات المطلوبة" },
    addCustomTag: { en: "Add", ar: "إضافة" },
    notes: { en: "Additional Notes (Optional)", ar: "ملاحظات إضافية (اختياري)" },
    semester: { en: "Semester", ar: "الفصل الدراسي" },
    publisherId: { en: "Your Student ID", ar: "الرقم الجامعي" },
    submit: { en: "Post Request", ar: "نشر الطلب" },
    update: { en: "Update Request", ar: "تحديث الطلب" },
    cancelEdit: { en: "Cancel", ar: "إلغاء" },
    listHead: { en: "Available Groups", ar: "المجموعات المتوفرة" },
    loadMore: { en: "Load More", ar: "تحميل المزيد" },
    contact: { en: "Contact", ar: "تواصل" },
    edit: { en: "Edit", ar: "تعديل" },
    delete: { en: "Delete", ar: "حذف" },
    daysLeft: { en: "days left to expire", ar: "يوم متبقٍ حتى إنتهاء الطلب" },
    noGroups: { en: "No available groups yet.", ar: "لا توجد مجموعات متوفرة حاليًا." },
    by: { en: "By", ar: "بواسطة" },
    id: { en: "ID", ar: "الرقم" },
    section: {
      idea: { en: "Project Idea", ar: "فكرة المشروع" },
      majors: { en: "Majors Needed", ar: "التخصصات المطلوبة" },
      notes: { en: "Notes", ar: "ملاحظات" },
    },
    validation: {
      title: { en: "Group title is required", ar: "اسم المجموعة مطلوب" },
      desc: { en: "Project idea is required", ar: "فكرة المشروع مطلوبة" },
      majors: { en: "Select at least one major or add a custom major", ar: "اختر تخصصًا أو أضف تخصص خاص" },
      sid: { en: "Valid student ID is required", ar: "الرقم الجامعي مطلوب" },
      semester: { en: "Semester is required", ar: "الفصل الدراسي مطلوب" },
      customTag: { en: "Custom major must be 2+ characters", ar: "التخصص الخاص يجب أن يكون حرفين فأكثر" },
    }
  }), [locale]);

  const canManage = (g: PracticumGroup) => user?.id && g.user_id === user.id;

  const resetForm = () => {
    setForm({ title: "", description: "", tags: [], notes: "", semester: SEMESTER_OPTIONS[0], publisherStudentId: "" });
    setEditingId(null);
    setCustomTag("");
    setErrors({});
  };

  const loadGroups = async (nextPage: number, refresh = false) => {
    setLoadingList(true);
    const resp: PaginatedResponse<PracticumGroup> = await practicumGroupService.getOpenGroups({ page: nextPage, limit: 10, sortBy: "created_at", sortOrder: "desc" });
    setLoadingList(false);
    if (refresh) {
      setGroups(resp.data);
    } else {
      setGroups(prev => [...prev, ...resp.data]);
    }
    setHasMore(resp.hasMore);
    setPage(nextPage);
  };

  useEffect(() => {
    loadGroups(1, true);
  }, []);

  const toggleMajor = (major: string) => {
    setForm(f => {
      const exists = f.tags.includes(major);
      const updated = exists ? f.tags.filter(t => t !== major) : [...f.tags, major];
      if (updated.length > 0) {
        setErrors((e) => ({ ...e, tags: undefined }));
      }
      return { ...f, tags: updated };
    });
  };

  const addCustomTag = () => {
    const v = customTag.trim();
    if (v.length < 2) {
      setErrors((e) => ({ ...e, customTag: locale === "ar" ? t.validation.customTag.ar : t.validation.customTag.en }));
      return;
    }
    setForm(f => ({ ...f, tags: f.tags.includes(v) ? f.tags : [...f.tags, v] }));
    setCustomTag("");
    setErrors((e) => ({ ...e, tags: undefined, customTag: undefined }));
  };

  const remainingDays = (expiresAt: string) => {
    const now = new Date();
    const exp = new Date(expiresAt);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = locale === "ar" ? t.validation.title.ar : t.validation.title.en;
    if (!form.description.trim()) newErrors.description = locale === "ar" ? t.validation.desc.ar : t.validation.desc.en;
    if (!form.publisherStudentId.trim() || !/^\d+$/.test(form.publisherStudentId.trim())) newErrors.publisherStudentId = locale === "ar" ? t.validation.sid.ar : t.validation.sid.en;
    if (!form.semester.trim()) newErrors.semester = locale === "ar" ? t.validation.semester.ar : t.validation.semester.en;
    if (form.tags.length === 0) newErrors.tags = locale === "ar" ? t.validation.majors.ar : t.validation.majors.en;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const { error } = await practicumGroupService.updateGroup(editingId, {
          title: form.title,
          description: form.description,
          tags: form.tags,
          notes: form.notes ?? null,
          semester: form.semester,
          publisher_student_id: form.publisherStudentId,
        }, user.id);
        if (!error) {
          resetForm();
          loadGroups(1, true);
        }
      } else {
        const { error } = await practicumGroupService.createGroup(
          {
            title: form.title,
            description: form.description,
            tags: form.tags,
            notes: form.notes,
            semester: form.semester,
            publisherStudentId: form.publisherStudentId,
          },
          user.id,
          user.email || "",
          (user.user_metadata as any)?.name || user.email || ""
        );
        if (!error) {
          resetForm();
          loadGroups(1, true);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (g: PracticumGroup) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      description: g.description,
      tags: g.tags || [],
      notes: g.notes || "",
      semester: g.semester,
      publisherStudentId: g.publisher_student_id || "",
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteGroup = async (id: number) => {
    if (!user) return;
    const ok = confirm(locale === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure to delete?");
    if (!ok) return;
    const { data } = await practicumGroupService.deleteGroup(id, user.id);
    if (data) {
      loadGroups(1, true);
    }
  };

  const contactMailto = (g: PracticumGroup) => {
    const email = `${g.publisher_student_id}@udst.edu.qa`;
    const subject = encodeURIComponent(`Practicum Group Interest: ${g.title}`);
    const body = encodeURIComponent(
      `Hello ${g.creator_name},\n\nI'm interested in your practicum group (${g.title}) for ${g.semester}.\n\nMy name: \nMajor: \nStudent ID: \n\nThanks!`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{ en: t.title.en, ar: t.title.ar }}
            description={{ en: t.desc.en, ar: t.desc.ar }}
          />

          {/* Form - Simple stacked layout with inline validation */}
          <Card className="bg-zinc-800/30 border-zinc-700/50">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium mb-4">
                {locale === "ar" ? t.formHead.ar : t.formHead.en}
              </h2>
              <form onSubmit={onSubmit} className="space-y-4">
                <Input
                  label={locale === "ar" ? t.groupTitle.ar : t.groupTitle.en}
                  value={form.title}
                  onChange={(e: any) => {
                    setForm(f => ({ ...f, title: e.target.value }));
                    if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
                  }}
                  placeholder={locale === "ar" ? "اكتب اسم المجموعة" : "Enter group title"}
                  error={!!errors.title}
                  helperText={errors.title}
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-zinc-300">
                    {locale === "ar" ? t.description.ar : t.description.en}
                  </label>
                  <textarea
                    className={`w-full rounded-lg bg-zinc-800/50 border ${errors.description ? "border-red-500" : "border-zinc-700"} px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none`}
                    rows={4}
                    value={form.description}
                    onChange={(e) => {
                      setForm(f => ({ ...f, description: e.target.value }));
                      if (errors.description) setErrors((er) => ({ ...er, description: undefined }));
                    }}
                    placeholder={locale === "ar" ? "وصف مختصر للفكرة" : "Brief description of the project"}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400">{errors.description}</p>
                  )}
                </div>

                <Input
                  label={locale === "ar" ? t.publisherId.ar : t.publisherId.en}
                  value={form.publisherStudentId}
                  onChange={(e: any) => {
                    setForm(f => ({ ...f, publisherStudentId: e.target.value }));
                    if (errors.publisherStudentId) setErrors((er) => ({ ...er, publisherStudentId: undefined }));
                  }}
                  placeholder={locale === "ar" ? "اكتب رقمك الجامعي" : "Enter your student ID"}
                  error={!!errors.publisherStudentId}
                  helperText={errors.publisherStudentId}
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-zinc-300">
                    {locale === "ar" ? t.semester.ar : t.semester.en}
                  </label>
                  <Select
                    value={form.semester}
                    onChange={(e: any) => {
                      setForm(f => ({ ...f, semester: e.target.value }));
                      if (errors.semester) setErrors((er) => ({ ...er, semester: undefined }));
                    }}
                  >
                    {SEMESTER_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                  {errors.semester && (
                    <p className="text-xs text-red-400">{errors.semester}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    {locale === "ar" ? t.tags.ar : t.tags.en}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MAJORS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMajor(m)}
                        className={`px-2 py-1 rounded-full border text-xs ${form.tags.includes(m) ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-zinc-900 text-zinc-300 border-zinc-700/50"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={customTag}
                      onChange={(e: any) => {
                        setCustomTag(e.target.value);
                        if (errors.customTag) setErrors((er) => ({ ...er, customTag: undefined }));
                      }}
                      placeholder={locale === "ar" ? "أدخل تخصص خاص" : "Enter a custom major"}
                      error={!!errors.customTag}
                      helperText={errors.customTag}
                    />
                    <Button type="button" onClick={addCustomTag}>
                      {locale === "ar" ? t.addCustomTag.ar : t.addCustomTag.en}
                    </Button>
                  </div>
                  {errors.tags && (
                    <p className="text-xs text-red-400">{errors.tags}</p>
                  )}
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[11px] border border-blue-500/20">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-zinc-300">
                    {locale === "ar" ? t.notes.ar : t.notes.en}
                  </label>
                  <textarea
                    className="w-full rounded-lg bg-zinc-800/50 border border-zinc-700 px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder={locale === "ar" ? "تفاصيل إضافية" : "Any extra details"}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={submitting || !user}>
                    {editingId ? (locale === "ar" ? t.update.ar : t.update.en) : (locale === "ar" ? t.submit.ar : t.submit.en)}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="secondary" onClick={resetForm}>
                      {locale === "ar" ? t.cancelEdit.ar : t.cancelEdit.en}
                    </Button>
                  )}
                </div>
                {!user && (
                  <p className="text-xs text-zinc-400">{locale === "ar" ? "سجّل الدخول لإنشاء طلب" : "Log in to post a request"}</p>
                )}
              </form>
            </div>
          </Card>

          {/* List */}
          <div className="space-y-3">
            <h2 className="text-lg font-medium">{locale === "ar" ? t.listHead.ar : t.listHead.en}</h2>
            {groups.length === 0 && !loadingList && (
              <p className="text-sm text-zinc-400">{locale === "ar" ? t.noGroups.ar : t.noGroups.en}</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {groups.map((g) => (
                <Card key={g.id} className="bg-zinc-900/50 border-zinc-800/60">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold shadow-blue-500/20">
                          {g.creator_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="text-white font-medium">{g.title}</div>
                          <div className="text-xs text-zinc-400">
                            {locale === "ar" ? t.by.ar : t.by.en}: {g.creator_name} • {locale === "ar" ? t.id.ar : t.id.en}: {g.publisher_student_id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{g.semester}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                          {Math.max(0, remainingDays(g.expires_at))} {locale === "ar" ? t.daysLeft.ar : t.daysLeft.en}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-700/30 text-zinc-300 border border-zinc-700/50">
                          {formatDate(g.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="h-px my-4 bg-zinc-800" />

                    {/* Body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">{locale === "ar" ? t.section.idea.ar : t.section.idea.en}</div>
                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{g.description}</p>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">{locale === "ar" ? t.section.majors.ar : t.section.majors.en}</div>
                        {g.tags?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {g.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[11px] border border-blue-500/20">{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-500">{locale === "ar" ? "لا توجد تخصصات محددة" : "No majors specified"}</div>
                        )}
                      </div>
                    </div>

                    {g.notes && (
                      <>
                        <div className="h-px my-4 bg-zinc-800" />
                        <div>
                          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">{locale === "ar" ? t.section.notes.ar : t.section.notes.en}</div>
                          <p className="text-sm text-zinc-400 whitespace-pre-wrap">{g.notes}</p>
                        </div>
                      </>
                    )}

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-end">
                      <div className="flex items-center gap-2">
                        <Button onClick={() => contactMailto(g)}>{locale === "ar" ? t.contact.ar : t.contact.en}</Button>
                        {canManage(g) && (
                          <>
                            <Button variant="secondary" onClick={() => startEdit(g)}>{locale === "ar" ? t.edit.ar : t.edit.en}</Button>
                            <Button variant="outline" onClick={() => deleteGroup(g.id)}>{locale === "ar" ? t.delete.ar : t.delete.en}</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {hasMore && (
              <div className="pt-2">
                <Button onClick={() => loadGroups(page + 1)} disabled={loadingList}>
                  {locale === "ar" ? t.loadMore.ar : t.loadMore.en}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
