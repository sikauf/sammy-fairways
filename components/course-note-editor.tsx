"use client";

import { useState, useTransition } from "react";

type CourseNoteEditorProps = {
  course_id: number; // bigint in Postgres maps to number in JS (safe for small ids)
  initial_text: string;
  save_text: (course_id: number, text: string) => Promise<void>;
};

export default function CourseNoteEditor({
  course_id,
  initial_text,
  save_text,
}: CourseNoteEditorProps) {
  const [text, set_text] = useState(initial_text);
  const [is_pending, start_transition] = useTransition();
  const [error_message, set_error_message] = useState<string | null>(null);
  const [saved_message, set_saved_message] = useState<string | null>(null);

  const on_save = () => {
    set_error_message(null);
    set_saved_message(null);

    start_transition(async () => {
      try {
        await save_text(course_id, text);
        set_saved_message("Saved!");
        // clear the "Saved!" message after a moment
        window.setTimeout(() => set_saved_message(null), 1200);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save note.";
        set_error_message(message);
      }
    });
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-medium text-white">Notes</h2>
        <button
          type="button"
          onClick={on_save}
          disabled={is_pending}
          className="px-4 py-2 rounded-lg bg-white/15 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {is_pending ? "Saving..." : "Save"}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => set_text(e.target.value)}
        placeholder="Add notes for this course..."
        className="w-full min-h-[140px] rounded-xl p-3 bg-white/10 border border-white/15 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
      />

      <div className="min-h-[20px]">
        {error_message ? (
          <p className="text-sm text-red-200">{error_message}</p>
        ) : saved_message ? (
          <p className="text-sm text-emerald-200">{saved_message}</p>
        ) : null}
      </div>
    </section>
  );
}
