import { Mic2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Mic2 size={26} />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading Speakvera...
        </p>
      </div>
    </main>
  );
}