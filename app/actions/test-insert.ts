"use server";

import { createClient } from "@/lib/supabase/server";

export async function testInsertCourse() {
  const supabase = await createClient();

  // Sanity check: make sure the server sees the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Auth error:", userError);
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("No authenticated user on server");
  }

  console.log("Server user id:", user.id);

  // IMPORTANT: do NOT pass user_id
  const { error } = await supabase.from("courses").insert({
    name: "Test Course",
    city: "Test City",
    state: "MI",
  });

  if (error) {
    console.error("Insert failed:", error);
    throw new Error(error.message);
  }

  console.log("Insert succeeded");
}
