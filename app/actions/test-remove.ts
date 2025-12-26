"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function testRemoveCourse() {
  // Find the most recently inserted "Test Course"
  const { data: rows, error: findError } = await supabase
    .from("courses")
    .select("id")
    .eq("name", "Test Course")
    .order("id", { ascending: false })
    .limit(1);

  if (findError) throw new Error(findError.message);

  const id = rows?.[0]?.id;
  if (!id) {
    throw new Error('No row found with name "Test Course".');
  }

  // Delete it
  const { error: deleteError } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (deleteError) throw new Error(deleteError.message);

  return { deletedId: id };
}
