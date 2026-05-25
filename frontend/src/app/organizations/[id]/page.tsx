"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import OfficerPanel from "@/components/OfficerPanel";
import OrganizationProfile from "@/components/OrganizationProfile";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isOfficerOf } from "@/lib/auth-utils";
import { Organization, orgApi } from "@/lib/api";

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const orgId = Number(id);
  const [org, setOrg] = useState<Organization | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrg = useCallback(() => {
    setError("");
    orgApi
      .get(orgId)
      .then(setOrg)
      .catch((e) => {
        setOrg(null);
        setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  useEffect(() => {
    const timer = setTimeout(() => loadOrg(), 0);
    return () => clearTimeout(timer);
  }, [loadOrg]);

  const myMembership = user?.memberships?.find(
    (m) => m.organization_id === orgId
  );
  const canJoin =
    user && (!myMembership || myMembership.status === "rejected");
  const showOfficer = user && isOfficerOf(user, orgId);

  async function handleJoin() {
    if (!user) {
      router.push("/login");
      return;
    }
    setStatus("");
    try {
      await orgApi.join(orgId, message);
      setStatus("Application submitted! Await officer approval.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Could not join");
    }
  }

  if (loading) return <p className="p-10 text-slate-500">Loading...</p>;
  if (!org) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error || "Organization not found."}
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Make sure the Laravel API is running on port 8000, then run in the{" "}
          <code className="rounded bg-slate-100 px-1">backend</code> folder:
        </p>
        <pre className="mt-2 rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
          php artisan migrate:fresh --seed{"\n"}php artisan serve
        </pre>
        <Link href="/organizations" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to organizations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/organizations" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to organizations
      </Link>

      <header className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{org.name}</h1>
        <OrganizationProfile org={org} />

        {myMembership && (
          <p className="mt-6 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Your status: {myMembership.status} ({myMembership.role})
          </p>
        )}

        {canJoin && (
          <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <h3 className="font-semibold text-indigo-900">Apply for membership</h3>
            <p className="mt-1 text-sm text-slate-600">
              Review membership requirements above before submitting your application.
            </p>
            <textarea
              placeholder="Optional message to officers (e.g. year level, skills)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={2}
            />
            <button
              onClick={handleJoin}
              className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Request to Join
            </button>
            {status && (
              <p className="mt-2 text-sm text-indigo-700">{status}</p>
            )}
          </div>
        )}

        {myMembership?.status === "pending" && (
          <p className="mt-4 text-sm text-amber-700">
            Your application is pending officer approval.
          </p>
        )}
      </header>

      {showOfficer && (
        <>
          <div className="mt-6 rounded-lg border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-900">
            You have <strong>officer access</strong> for this organization. Use the
            panel below to approve members and post updates.
          </div>
          <OfficerPanel organizationId={orgId} onRefresh={loadOrg} />
        </>
      )}

      {user && !showOfficer && isAdmin(user) && (
        <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          Logged in as <strong>Admin</strong> — open any organization to use officer
          tools, or go to <Link href="/admin/organizations" className="underline">Admin</Link>.
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Upcoming Events</h2>
          <ul className="mt-4 space-y-3">
            {(org.events || []).map((ev) => (
              <li key={ev.id} className="text-sm">
                <p className="font-medium text-slate-800">{ev.title}</p>
                <p className="text-slate-500">
                  {new Date(ev.starts_at).toLocaleString()}
                  {ev.location && ` · ${ev.location}`}
                </p>
              </li>
            ))}
            {!org.events?.length && (
              <p className="text-sm text-slate-500">No events yet.</p>
            )}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Announcements</h2>
          <ul className="mt-4 space-y-3">
            {(org.announcements || []).map((a) => (
              <li key={a.id} className="text-sm">
                <p className="font-medium text-slate-800">
                  {a.is_pinned && "📌 "}
                  {a.title}
                </p>
                <p className="text-slate-500 line-clamp-2 whitespace-pre-wrap">
                  {a.body}
                </p>
              </li>
            ))}
            {!org.announcements?.length && (
              <p className="text-sm text-slate-500">No announcements yet.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
