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
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${crypto.randomUUID()}.${ext}`;
      const path = `course_${courseId}/${filename}`;

      const { data, error: uploadError } = await supabase.storage
        .from("course_images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // If the bucket is PUBLIC:
      const { data: urlData } = supabase.storage
        .from("course_images")
        .getPublicUrl(data.path);

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
      <input type="file" accept="image/*" disabled={isUploading} onChange={onChange} />
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
