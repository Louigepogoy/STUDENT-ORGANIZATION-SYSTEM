"use client";

import { FormEvent, useState } from "react";
import { announcementApi, eventApi } from "@/lib/api";
import PendingApplications from "./PendingApplications";

export default function OfficerPanel({
  organizationId,
  onRefresh,
}: {
  organizationId: number;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<"applications" | "event" | "announcement">(
    "applications"
  );
  const [msg, setMsg] = useState("");

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    starts_at: "",
    ends_at: "",
  });

  const [annForm, setAnnForm] = useState({
    title: "",
    body: "",
    is_pinned: false,
  });

  async function submitEvent(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await eventApi.create({
        organization_id: organizationId,
        title: eventForm.title,
        description: eventForm.description || undefined,
        location: eventForm.location || undefined,
        starts_at: new Date(eventForm.starts_at).toISOString(),
        ends_at: eventForm.ends_at
          ? new Date(eventForm.ends_at).toISOString()
          : undefined,
      });
      setEventForm({
        title: "",
        description: "",
        location: "",
        starts_at: "",
        ends_at: "",
      });
      setMsg("Event created.");
      onRefresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed to create event");
    }
  }

  async function submitAnnouncement(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await announcementApi.create({
        organization_id: organizationId,
        title: annForm.title,
        body: annForm.body,
        is_pinned: annForm.is_pinned,
      });
      setAnnForm({ title: "", body: "", is_pinned: false });
      setMsg("Announcement posted.");
      onRefresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed to post announcement");
    }
  }

  const tabs = [
    { id: "applications" as const, label: "Applications" },
    { id: "event" as const, label: "New Event" },
    { id: "announcement" as const, label: "New Announcement" },
  ];

  return (
    <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
      <h2 className="text-lg font-semibold text-indigo-900">Officer Panel</h2>
      <p className="mt-1 text-sm text-indigo-700">
        Manage membership requests, events, and announcements.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setMsg("");
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === t.id
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && <p className="mt-3 text-sm text-indigo-800">{msg}</p>}

      <div className="mt-4">
        {tab === "applications" && (
          <PendingApplications
            organizationId={organizationId}
            onUpdated={onRefresh}
          />
        )}

        {tab === "event" && (
          <form onSubmit={submitEvent} className="space-y-3">
            <input
              required
              placeholder="Event title"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={2}
            />
            <input
              placeholder="Location"
              value={eventForm.location}
              onChange={(e) =>
                setEventForm({ ...eventForm, location: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-600">Starts at</label>
                <input
                  type="datetime-local"
                  required
                  value={eventForm.starts_at}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, starts_at: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Ends at (optional)</label>
                <input
                  type="datetime-local"
                  value={eventForm.ends_at}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, ends_at: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Create Event
            </button>
          </form>
        )}

        {tab === "announcement" && (
          <form onSubmit={submitAnnouncement} className="space-y-3">
            <input
              required
              placeholder="Title"
              value={annForm.title}
              onChange={(e) =>
                setAnnForm({ ...annForm, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <textarea
              required
              placeholder="Announcement body"
              value={annForm.body}
              onChange={(e) =>
                setAnnForm({ ...annForm, body: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={4}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={annForm.is_pinned}
                onChange={(e) =>
                  setAnnForm({ ...annForm, is_pinned: e.target.checked })
                }
              />
              Pin this announcement
            </label>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Post Announcement
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
