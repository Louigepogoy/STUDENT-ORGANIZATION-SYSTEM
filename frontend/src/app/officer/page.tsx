"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isOfficer, officerOrganizations } from "@/lib/auth-utils";
import { Membership, membershipApi } from "@/lib/api";

export default function OfficerPage() {
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
    if (!isOfficer(user) && !isAdmin(user)) {
      router.push("/dashboard");
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
    return <p className="p-10 text-slate-500">Loading officer panel...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Officer Panel</h1>
      <p className="mt-2 text-slate-600">
        Manage membership applications, events, and announcements for your
        organizations.
      </p>

      {isAdmin(user) && (
        <p className="mt-4 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          You are logged in as <strong>Admin</strong> — you can use officer tools
          on every organization page.
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {officerOrgs.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {m.organization?.name || `Organization #${m.organization_id}`}
                </h2>
                <p className="mt-1 text-sm text-amber-800">
                  Your role: <strong>{m.role}</strong>
                </p>
              </div>
              <Link
                href={`/organizations/${m.organization_id}`}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Open Officer Tools
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              On the organization page, scroll to the <strong>Officer Panel</strong>{" "}
              to approve members, create events, and post announcements.
            </p>
          </li>
        ))}
      </ul>

      {officerOrgs.length === 0 && (
        <p className="mt-8 text-slate-500">
          No officer assignments found. Log in as{" "}
          <code className="rounded bg-slate-100 px-1">officer@school.edu</code>.
        </p>
      )}
    </div>
  );
}
