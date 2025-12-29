"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function removeCourse(courseId: number) {
  const supabase = createAdminClient();

  if (!Number.isFinite(courseId)) {
    throw new Error(`Invalid courseId: ${courseId}`);
  }

  const folder = `course_${courseId}`;

  // 1) Best-effort: remove all images in storage for this course
  // (Doesn't block course deletion if storage cleanup fails.)
  try {
    const { data: files, error: listError } = await supabase.storage
      .from("course_images")
      .list(folder, { limit: 1000 });

    if (listError) throw new Error(listError.message);

    const paths = (files ?? []).map((f) => `${folder}/${f.name}`);

    if (paths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from("course_images")
        .remove(paths);

      if (removeError) throw new Error(removeError.message);
    }
  } catch (e) {
    console.error("Failed to delete course images:", e);
    // If you want to HARD FAIL instead, replace this catch block with: throw e;
  }

  // 2) Delete course row (admin client => no RLS issues)
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) throw new Error(error.message);

  return { ok: true };
}
