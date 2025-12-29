import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CourseImageUploader from "@/components/course-image-uploader";
import HomeButton from "@/components/back-to-home";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id } = await params; // ✅ REQUIRED
  const courseId = Number(course_id);

  if (!Number.isFinite(courseId)) {
    notFound();
  }

  const supabase = await createClient();

  // Get course name
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("name")
    .eq("id", courseId)
    .single();

  if (courseErr) throw new Error(courseErr.message);
  if (!course) throw new Error("No course found");

  const folder = `course_${courseId}`;

  // List all images in this course's folder
  const { data: files, error: listErr } = await supabase.storage
    .from("course_images")
    .list(folder, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (listErr) console.error(listErr);

  const images =
    files?.map(
      (file) =>
        supabase.storage
          .from("course_images")
          .getPublicUrl(`${folder}/${file.name}`).data.publicUrl
    ) ?? [];

  return (
    <main style={{ padding: 24 }}>
      <h1 className="text-4xl font-extrabold">{course.name}</h1>

      <CourseImageUploader courseId={courseId} />

      <section style={{ marginTop: 24 }}>
        <h2>Course Images</h2>

        {images.length === 0 && <p>No images yet.</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt="Course"
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #e5e5e5",
              }}
            />
          ))}
        </div>
      </section>

      <section className="p-6">
        <HomeButton />
      </section>
    </main>
  );
}
