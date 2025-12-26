import TestInsertButton from "@/components/test-insert-button";
import TestRemoveButton from "@/components/test-remove-button";
import CourseSearch from "@/components/course-search";

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function CoursesData() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("Courses")
    .select("id, name, city, state")
    .order("name", { ascending: true });

  if (error) {
    return (
      <p className="text-red-600">
        Failed to load courses: {error.message}
      </p>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <p className="text-muted-foreground italic">
        No courses yet. Add one to get started.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <li
          key={course.id}
          className="border rounded-xl p-5 bg-card hover:shadow-sm transition"
        >
          <h3 className="font-semibold text-lg">{course.name}</h3>
          <p className="text-sm text-muted-foreground">
            {[course.city, course.state].filter(Boolean).join(", ") ||
              "Location unknown"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center bg-background">
      <div className="w-full max-w-5xl px-6 py-12 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Sammy Fairways ⛳️
          </h1>
          <p className="text-muted-foreground max-w-xl">
            A personal log of golf courses I’ve played.
          </p>
        </header>

        {/* Courses */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Courses Played</h2>

          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <CourseSearch />
            <CoursesData />
            <TestInsertButton />
            <TestRemoveButton />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
