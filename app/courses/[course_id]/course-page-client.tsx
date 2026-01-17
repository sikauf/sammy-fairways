"use client";

import { useEffect, useMemo, useState } from "react";
import CourseImageUploader from "@/components/course-image-uploader";
import { createClient } from "@/lib/supabase/client";

type Status = "loading" | "ready" | "error";

export default function CoursePageClient({ courseId }: { courseId: number }) {
  const supabase = useMemo(() => createClient(), []);

  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const [courseName, setCourseName] = useState<string>("");

  const [images, setImages] = useState<string[]>([]);

  async function load() {
    setStatus("loading");
    setError(null);

    // 1) course name
    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .select("name")
      .eq("id", courseId)
      .maybeSingle();

    if (courseErr) {
      setError(courseErr.message);
      setStatus("error");
      return;
    }
    if (!course) {
      setError("No course found");
      setStatus("error");
      return;
    }
    setCourseName(course.name);

    // 2) load image rows from course_images table (table-backed ✅)
    const { data: rows, error: rowsErr } = await supabase
      .from("course_images")
      .select("path, created_at")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (rowsErr) {
      console.error(rowsErr);
      setImages([]);
      setStatus("ready");
      return;
    }

    const urls =
      rows
        ?.map((r) => r.path)
        .filter((p): p is string => typeof p === "string" && p.length > 0)
        .map(
          (path) =>
            supabase.storage.from("course_images").getPublicUrl(path).data
              .publicUrl
        ) ?? [];

    setImages(urls);
    setStatus("ready");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (status === "loading") {
    return <p>Loading…</p>;
  }

  if (status === "error") {
    return (
      <div>
        <h1 className="text-4xl font-extrabold">Course</h1>
        <p style={{ color: "crimson", marginTop: 12 }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-extrabold">{courseName}</h1>

      {/* uploader */}
      <CourseImageUploader courseId={courseId} />

      <section style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2>Course Images</h2>
          <button
            onClick={load}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: "6px 10px",
            }}
          >
            Refresh
          </button>
        </div>

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
    </>
  );
}
