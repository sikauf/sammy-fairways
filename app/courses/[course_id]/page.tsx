import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CourseImageUploader from "@/components/course-image-uploader";

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

  // List all images in this course's folder
  const { data: files, error } = await supabase.storage
    .from("course_images")
    .list(`course_${course_id}`, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    const { data } = await supabase
  .from("courses")
  .select("name")
  .eq("id", course_id_number)
  .single();

    if (!data) {
    throw new Error("No course found");
    }

    const course_name = data.name;


  if (error) {
    console.error(error);
  }

  const images =
    files?.map((file) =>
      supabase.storage
        .from("course_images")
        .getPublicUrl(`course_${course_id}/${file.name}`).data.publicUrl
    ) ?? [];


  return (
    <main style={{ padding: 24 }}>
     <h1 className="text-4xl font-extrabold">
        {course_name}
     </h1>


      {/* Upload UI (only exists on this route) */}
      <CourseImageUploader courseId={course_id_number} />

      {/* Image gallery */}
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
    </main>
  );
}
