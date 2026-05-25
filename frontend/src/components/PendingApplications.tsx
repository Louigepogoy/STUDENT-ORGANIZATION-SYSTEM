"use client";

import { useCallback, useEffect, useState } from "react";
import { Membership, membershipApi } from "@/lib/api";

export default function PendingApplications({
  organizationId,
  onUpdated,
}: {
  organizationId: number;
  onUpdated?: () => void;
}) {
  const [pending, setPending] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPending = useCallback(() => {
    membershipApi
      .pending(organizationId)
      .then(setPending)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [organizationId]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  async function handleAction(
    id: number,
    status: "approved" | "rejected",
    role?: string
  ) {
    setError("");
    try {
      await membershipApi.update(id, status, role);
      loadPending();
      onUpdated?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading applications...</p>;
  }

  if (!pending.length) {
    return (
      <p className="text-sm text-slate-500">No pending membership applications.</p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {pending.map((m) => (
        <div
          key={m.id}
          className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3"
        >
          <p className="font-medium text-slate-900">{m.user?.name}</p>
          <p className="text-xs text-slate-500">
            {m.user?.email}
            {m.user?.student_id && ` · ${m.user.student_id}`}
          </p>
          {m.message && (
            <p className="mt-2 text-sm text-slate-600">&ldquo;{m.message}&rdquo;</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => handleAction(m.id, "approved", "member")}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(m.id, "approved", "officer")}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Approve as Officer
            </button>
            <button
              onClick={() => handleAction(m.id, "rejected")}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
