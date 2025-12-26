"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function removeCourse(courseId: number) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) throw new Error(error.message);

  return { ok: true };
}
