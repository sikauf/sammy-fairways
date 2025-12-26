import CourseSearch from "@/components/course-search";
import RemoveCourseButton from "@/components/remove-course-button";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function CoursesData() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, name, city, state")
    .order("name", { ascending: true });

  if (error) {
    return (
      <p className="text-red-200">
        Failed to load courses: {error.message}
      </p>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <p className="text-white/80 italic">
        No courses yet. Add one using the search above.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <li
          key={course.id}
          className="border border-white/15 rounded-xl p-5 bg-white/10 backdrop-blur hover:bg-white/15 transition"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate text-white">
                {course.name}
              </h3>
              <p className="text-sm text-white/80">
                {[course.city, course.state].filter(Boolean).join(", ") ||
                  "Location unknown"}
              </p>
            </div>

            <RemoveCourseButton courseId={course.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main
      className="min-h-screen flex justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.webp')" }}
    >
      <div className="min-h-screen w-full bg-black/50">
        <div className="w-full max-w-5xl px-6 py-12 flex flex-col gap-10 mx-auto">
          <header className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Sammy Fairways ⛳️
            </h1>
            <p className="text-white/80 max-w-xl">
              A personal log of golf courses I’ve played.
            </p>
          </header>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white">Add a Course</h2>
            <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-4">
              <CourseSearch />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white">Courses Played</h2>

            <Suspense
              fallback={
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-28 rounded-xl bg-white/10 animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <CoursesData />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
