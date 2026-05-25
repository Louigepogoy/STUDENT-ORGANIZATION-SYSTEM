"use client";

import { useEffect, useState } from "react";
import { Event, eventApi } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi
      .list({ upcoming: true })
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Upcoming Events</h1>
      <p className="mt-1 text-slate-600">Campus activities from student organizations.</p>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading events...</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{ev.title}</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700">
                  {ev.status}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-indigo-600">
                {ev.organization?.name}
              </p>
              {ev.description && (
                <p className="mt-2 text-sm text-slate-600">{ev.description}</p>
              )}
              <p className="mt-3 text-sm text-slate-500">
                {new Date(ev.starts_at).toLocaleString()}
                {ev.location && ` · ${ev.location}`}
              </p>
            </li>
          ))}
          {!events.length && (
            <p className="text-slate-500">No upcoming events.</p>
          )}
        </ul>
      )}
    </div>
  );
}
