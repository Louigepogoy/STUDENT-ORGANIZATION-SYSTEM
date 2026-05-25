"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isOfficer, officerOrganizations, roleLabel } from "@/lib/auth-utils";
import { Membership, membershipApi } from "@/lib/api";

export default function DashboardPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/login");
      return;
    }
    membershipApi
      .mine()
      .then(setMemberships)
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, [user, ready, router]);

  const officerOrgs = officerOrganizations(user, memberships);

  if (!ready || loading) {
    return <p className="p-10 text-slate-500">Loading dashboard...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
       <h1 className="text-3xl font-bold text-slate-900">
         {user?.role === 'student' ? 'Jemarlee Dashboard' : 
          user?.role === 'officer' ? 'Louige Pogoy Dashboard' : 
          user?.role === 'admin' ? 'Rey Inoc Dashboard' : 
          'My Dashboard'}
       </h1>
      <p className="mt-1 text-slate-600">
        Welcome, {user?.name}
        {user?.student_id && ` (${user.student_id})`}
      </p>
      {user && (
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            roleLabel(user) === "Admin"
              ? "bg-indigo-100 text-indigo-800"
              : roleLabel(user) === "Officer"
                ? "bg-amber-100 text-amber-900"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          Logged in as {roleLabel(user)}
        </span>
      )}

      {isAdmin(user) && (
        <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="font-medium text-indigo-900">Administrator</p>
          <Link
            href="/admin/organizations"
            className="mt-2 inline-block text-sm font-medium text-indigo-700 hover:underline"
          >
            Manage organizations &rarr;
          </Link>
        </div>
      )}

      {isOfficer(user) && (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">Officer Panel</h2>
          <p className="mt-1 text-sm text-amber-800">
            Approve members, create events, and post announcements.
          </p>
          <Link
            href="/officer"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Go to Officer Panel →
          </Link>
          {officerOrgs.length > 0 && (
            <ul className="mt-4 space-y-2">
              {officerOrgs.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/organizations/${m.organization_id}`}
                    className="text-sm font-medium text-indigo-700 hover:underline"
                  >
                    {m.organization?.name || `Org #${m.organization_id}`} — manage
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!isAdmin(user) && !isOfficer(user) && (
        <p className="mt-4 text-sm text-slate-500">
          To see Admin or Officer features, log out and use the demo buttons on the{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            login page
          </Link>
          .
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My Memberships</h2>
        <ul className="mt-4 space-y-3">
          {memberships.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <Link
                  href={`/organizations/${m.organization_id}`}
                  className="font-medium text-indigo-700 hover:underline"
                >
                  {m.organization?.name}
                </Link>
                <p className="text-xs text-slate-500">
                  Role: {m.role} · Status: {m.status}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                  m.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : m.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {m.status}
              </span>
            </li>
          ))}
          {!memberships.length && (
            <p className="text-sm text-slate-500">
              You are not a member of any organization yet.{" "}
              <Link href="/organizations" className="text-indigo-600 hover:underline">
                Browse organizations
              </Link>
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}
