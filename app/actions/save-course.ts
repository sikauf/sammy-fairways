"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function saveCourseFromList(courseListId: number) {
  const supabase = createAdminClient();

  const { data: course, error: fetchError } = await supabase
    .from("course_list")
    .select("id, name, city, state, holes, access")
    .eq("id", courseListId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const name = (course?.name ?? "").trim();
  if (!name) {
    throw new Error("Selected course is missing a name in course_list.");
  }

  const { error: insertError } = await supabase.from("courses").insert({
    course_list_id: course.id,
    name,
    city: course.city ?? null,
    state: course.state ?? null,
    holes: course.holes ?? null,
    access: course.access ?? null,
  });

  if (insertError) throw new Error(insertError.message);

  return { ok: true };
}
