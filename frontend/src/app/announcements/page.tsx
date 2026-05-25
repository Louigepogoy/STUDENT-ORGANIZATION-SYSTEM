"use client";

import { useEffect, useState } from "react";
import { Announcement, announcementApi } from "@/lib/api";

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementApi
      .list()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
      <p className="mt-1 text-slate-600">Latest news from student organizations.</p>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading...</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((a) => (
            <li
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                {a.is_pinned && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Pinned
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {a.organization?.name}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{a.title}</h2>
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{a.body}</p>
              <p className="mt-3 text-xs text-slate-400">
                {a.author?.name} · {new Date(a.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
          {!items.length && <p className="text-slate-500">No announcements yet.</p>}
        </ul>
      )}
    </div>
  );
}
