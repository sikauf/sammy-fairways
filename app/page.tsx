import TestInsertButton from "@/components/test-insert-button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-4xl font-bold">Sammy Fairways ⛳️</h1>

        <p className="text-muted-foreground text-center max-w-md">
          Sanity check page to verify Supabase insert connectivity.
        </p>

        {/* This component IS the button */}
        <TestInsertButton />
      </div>
    </main>
  );
}
