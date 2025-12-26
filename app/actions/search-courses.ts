"use server";

import { createClient } from "@/lib/supabase/server";

export type CourseSearchResult = {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
  holes: number | null;
  access: string | null;
};

export async function searchCourses(query: string): Promise<CourseSearchResult[]> {
  const supabase = await createClient();

  const q = query.trim();
  if (!q) return [];

  // Simple search: name/city/state contains query (case-insensitive)
  const { data, error } = await supabase
    .from("course_list")
    .select("id, name, city, state, holes, access")
    .or(`name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`)
    .order("name", { ascending: true })
    .limit(25);

  if (error) throw new Error(error.message);

  return (data ?? []) as CourseSearchResult[];
}
