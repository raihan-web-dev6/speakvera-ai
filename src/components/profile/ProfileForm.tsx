"use client";

import {
  CheckCircle2,
  Loader2,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type ProfileData = {
  user: {
    name: string;

    email: string;

    image?: string;

    currentLevel?: string;

    createdAt?: string;
  };
};

export default function ProfileForm() {
  const [
    profile,
    setProfile,
  ] =
    useState<ProfileData | null>(
      null
    );

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            "/api/user/profile",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        setProfile(data);

        setName(
          data.user?.name ||
            ""
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load profile"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function save() {
    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const response =
        await fetch(
          "/api/user/profile",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not update profile"
        );
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-3xl">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-blue-600">
            {profile.user
              .image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  profile.user
                    .image
                }
                alt={
                  profile.user
                    .name
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound
                size={31}
              />
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              {
                profile.user
                  .name
              }
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {
                profile.user
                  .email
              }
            </p>

            {profile.user
              .currentLevel && (
              <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Estimated level:{" "}
                {
                  profile.user
                    .currentLevel
                }
              </span>
            )}
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold text-slate-700">
            Full name
          </label>

          <input
            value={name}
            onChange={(
              event
            ) =>
              setName(
                event.target
                  .value
              )
            }
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700">
            Email
          </label>

          <input
            value={
              profile.user
                .email
            }
            disabled
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-500"
          />
        </div>

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2
              size={17}
            />

            {success}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={
            saving
          }
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white disabled:opacity-60"
        >
          {saving && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          Save profile
        </button>
      </section>
    </div>
  );
}