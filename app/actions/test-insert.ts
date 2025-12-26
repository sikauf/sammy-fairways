"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function testInsertCourse() {
  const { error } = await supabase
    .from("courses")
    .insert({
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
