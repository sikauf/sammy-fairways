"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CourseImageUploader({ courseId }: { courseId: number }) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setUploadedUrl(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setIsUploading(true);
    try {
      // Ensure we have an authenticated user (helps produce better errors)
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${crypto.randomUUID()}.${ext}`;

      // Recommended: include user id in the path to avoid any chance of collisions
      // and to make storage policies easier later.
      const path = `${user.id}/course_${courseId}/${filename}`;

      // 1) Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("course_images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // 2) Insert metadata row into DB (table-backed ✅)
      const { error: dbError } = await supabase.from("course_images").insert({
        course_id: courseId,
        path: uploadData.path, // full path in bucket
        // user_id will be set by default auth.uid()
      });

      if (dbError) {
        // Optional cleanup: if DB insert fails, remove the uploaded file
        await supabase.storage.from("course_images").remove([uploadData.path]);
        throw dbError;
      }

      // 3) Show preview (bucket must be public for getPublicUrl to work)
      const { data: urlData } = supabase.storage
        .from("course_images")
        .getPublicUrl(uploadData.path);

      setUploadedUrl(urlData.publicUrl);
    } catch (err: any) {
      setError(err?.message ?? "Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
      <input
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={onChange}
      />
      {isUploading && <p>Uploading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {uploadedUrl && (
        <>
          <p>Uploaded:</p>
          <img
            src={uploadedUrl}
            alt="Uploaded course"
            style={{ width: "100%", borderRadius: 12, border: "1px solid #ddd" }}
          />
        </>
      )}
    </div>
  );
}
