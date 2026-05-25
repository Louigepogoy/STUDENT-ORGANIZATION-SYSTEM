"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Organization, orgApi } from "@/lib/api";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orgApi
      .list({ search: search || undefined })
      .then((res) => setOrgs(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Registered Organizations
          </h1>
          <p className="mt-1 max-w-xl text-slate-600">
            Official school-recognized student groups. Each profile includes mission,
            membership requirements, adviser, and contact information.
          </p>
          <Link
            href="/about"
            className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            What are student organizations? →
          </Link>
        </div>
        <input
          type="search"
          placeholder="Search name, category, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2 sm:w-72"
        />
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-800">
          <p className="font-medium">{error}</p>
          <p className="mt-2 text-sm">
            Start the backend in a terminal:
          </p>
          <pre className="mt-2 rounded bg-slate-900 px-3 py-2 text-xs text-white">
            cd backend{"\n"}php artisan serve
          </pre>
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-slate-500">Loading organizations...</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {org.category || "General"}
                </span>
                {org.org_type && (
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs text-violet-700">
                    {org.org_type}
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-indigo-700">
                {org.name}
              </h2>
              {org.department && (
                <p className="text-xs text-slate-500">{org.department}</p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {org.mission || org.description}
              </p>
              <div className="mt-auto pt-4 text-xs text-slate-500 space-y-1">
                {org.meeting_schedule && (
                  <p>📅 {org.meeting_schedule}</p>
                )}
                {org.adviser?.name && (
                  <p>Adviser: {org.adviser.name}</p>
                )}
                <p>{org.members_count ?? 0} members · Est. {org.founded_year || "—"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
