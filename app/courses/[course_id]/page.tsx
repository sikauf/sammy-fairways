import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single();

  if (!course) return notFound();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{course.name}</h1>
      <p className="opacity-70">
        {course.city}, {course.state}
      </p>

      {/* This is where “store information” happens */}
      <section>
        <h2 className="text-xl font-medium">Rounds</h2>
        {/* rounds go here */}
      </section>

      <section>
        <h2 className="text-xl font-medium">Photos</h2>
        {/* course_images go here */}
      </section>
    </main>
  );
}
