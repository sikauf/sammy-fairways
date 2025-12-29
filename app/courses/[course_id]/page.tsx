import { notFound } from "next/navigation";
import CoursePageClient from "./course-page-client";
import HomeButton from "@/components/back-to-home";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id } = await params;
  const courseId = Number(course_id);
  if (!Number.isFinite(courseId)) return notFound();

  return (
    <main style={{ padding: 24 }}>
      <CoursePageClient courseId={courseId} />

      <section className="p-6">
        <HomeButton />
      </section>
    </main>
  );
}
