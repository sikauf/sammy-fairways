"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchCourses, type CourseSearchResult } from "@/app/actions/search-courses";
import { saveCourseFromList } from "@/app/actions/save-course";

export default function CourseSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CourseSearchResult[]>([]);
  const [pendingSearch, startSearch] = useTransition();
  const [pendingSave, startSave] = useTransition();

  // Debounced search
  useEffect(() => {
    const q = query.trim();

    const t = setTimeout(() => {
      startSearch(async () => {
        try {
          const rows = await searchCourses(q);
          setResults(rows);
        } catch (e) {
          console.error(e);
          setResults([]);
        }
      });
    }, 250);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Search courses</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "Pebble", "Ann Arbor", or "MI"...'
          className="border rounded-md px-3 py-2 text-sm"
        />

        <div className="text-xs text-muted-foreground">
          {pendingSearch
            ? "Searching..."
            : query.trim()
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "Type to search"}
        </div>
      </div>

      {query.trim() && results.length === 0 && !pendingSearch && (
        <p className="text-sm text-muted-foreground italic">No matches found.</p>
      )}

      <ul className="flex flex-col gap-2">
        {results.map((c) => (
          <li
            key={c.id}
            className="border rounded-lg p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">{c.name}</div>
              <div className="text-sm text-muted-foreground truncate">
                {[c.city, c.state].filter(Boolean).join(", ") || "Location unknown"}
              </div>
            </div>

            <button
              type="button"
              disabled={pendingSave}
              className="px-3 py-2 rounded-md border text-sm font-medium whitespace-nowrap"
              onClick={() => {
                startSave(async () => {
                  try {
                    await saveCourseFromList(c.id);
                    alert("Added to your courses!");
                    router.refresh();
                  } catch (e: any) {
                    console.error(e);
                    alert(e?.message ?? "Failed to add course");
                  }
                });
              }}
            >
              {pendingSave ? "Adding..." : "Select"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
