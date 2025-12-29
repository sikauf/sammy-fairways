import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  // ✅ wait for params
  const { course_id } = await params;

  const course_id_number = Number(course_id);
  if (!Number.isFinite(course_id_number)) return notFound();

  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select("id, name")
    .eq("id", course_id_number)
    .single();

  if (error || !course) return notFound();

  // fetch saved text for this course
    const { data: text_row, error: text_error } = await supabase
    .from("test_text")
    .select("text")
    .eq("course_id", course_id_number)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

    const saved_text = text_row?.text ?? "";


  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-semibold">
        Course ID: {course.id}
      </h1>
      <p className="mt-2">Name: {course.name}</p>

        {saved_text && (
    <section className="border border-white/15 rounded-lg p-4 bg-white/10">
        <h2 className="text-sm font-semibold opacity-70 mb-2">
        Saved Text
        </h2>
        <p className="whitespace-pre-wrap text-white">
        {saved_text}
        </p>
    </section>
    )}

    </main>
  );
}
