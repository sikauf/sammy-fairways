"use client";

import { useEffect, useState, useTransition } from "react";
import { searchCourses, type CourseSearchResult } from "@/app/actions/search-courses";

export default function CourseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CourseSearchResult[]>([]);
  const [pending, startTransition] = useTransition();

  // tiny debounce so it doesn't fire on every keystroke instantly
  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(async () => {
        try {
          const rows = await searchCourses(query);
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
          {pending ? "Searching..." : query.trim() ? `${results.length} results` : "Type to search"}
        </div>
      </div>

      {query.trim() && results.length === 0 && !pending && (
        <p className="text-sm text-muted-foreground italic">No matches found.</p>
      )}

      <ul className="flex flex-col gap-2">
        {results.map((c) => (
          <li key={c.id} className="border rounded-lg p-4">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">
              {[c.city, c.state].filter(Boolean).join(", ") || "Location unknown"}
              {c.holes ? ` • ${c.holes} holes` : ""}
              {c.access ? ` • ${c.access}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
