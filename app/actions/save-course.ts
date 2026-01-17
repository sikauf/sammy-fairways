"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveCourseFromList(courseListId: number) {
  // ✅ USER-AWARE, COOKIE-AWARE CLIENT
  const supabase = await createClient();

  // ✅ Confirm authenticated user exists on the server
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("Not authenticated");

  // Fetch course details from course_list
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

  // IMPORTANT:
  // ❌ Do NOT pass user_id
  // ✅ DB default auth.uid() will populate it
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
