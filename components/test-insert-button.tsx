"use client";

import { testInsertCourse } from "@/app/actions/test-insert";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function TestInsertButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await testInsertCourse();
          alert("Insert succeeded!");
        })
      }
    >
      {pending ? "Inserting..." : "Test Insert"}
    </Button>
  );
}
