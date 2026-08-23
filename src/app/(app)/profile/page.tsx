import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-blue-600">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Your profile
        </h1>

        <p className="mt-3 text-slate-600">
          Manage your personal Speakvera information.
        </p>

        <div className="mt-8">
          <ProfileForm />
        </div>
      </div>
    </main>
  );
}