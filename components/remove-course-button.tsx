"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCourse } from "@/app/actions/remove-course";

export default function RemoveCourseButton({ courseId }: { courseId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted transition"
      onClick={() => {
        const ok = confirm("Warning: This will permanently delete the course and all its images. Continue?");
        if (!ok) return;

        startTransition(async () => {
          try {
            await removeCourse(courseId);
            router.refresh();
          } catch (e) {
            console.error(e);
            alert("Failed to remove course. Check console.");
          }
        });
      }}
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}
