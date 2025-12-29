"use client";

import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
    >
      Back to Home
    </button>
  );
}
