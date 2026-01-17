"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthDebug() {
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        alert("Auth error: " + error.message);
        return;
      }

      if (!data.user) {
        alert("No user found on client");
        return;
      }

      alert(`✅ Logged in as user:\n\n${data.user.id}`);
    });
  }, []);

  return null; // this component renders nothing
}
