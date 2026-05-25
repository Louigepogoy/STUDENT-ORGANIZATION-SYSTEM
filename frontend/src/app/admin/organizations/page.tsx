"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/auth-utils";
import { Organization, OrgPayload, orgApi } from "@/lib/api";

const emptyForm: OrgPayload = {
  name: "",
  description: "",
  category: "",
  org_type: "",
  department: "",
  founded_year: undefined,
  mission: "",
  vision: "",
  objectives: "",
  membership_requirements: "",
  meeting_schedule: "",
  office_location: "",
  contact_email: "",
  contact_phone: "",
  status: "active",
};

function orgToForm(org: Organization): OrgPayload {
  return {
    name: org.name,
    description: org.description || "",
    category: org.category || "",
    org_type: org.org_type || "",
    department: org.department || "",
    founded_year: org.founded_year,
    mission: org.mission || "",
    vision: org.vision || "",
    objectives: org.objectives || "",
    membership_requirements: org.membership_requirements || "",
    meeting_schedule: org.meeting_schedule || "",
    office_location: org.office_location || "",
    contact_email: org.contact_email || "",
    contact_phone: org.contact_phone || "",
    status: org.status,
  };
}

export default function AdminOrganizationsPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [form, setForm] = useState<OrgPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  function loadOrgs() {
    orgApi
      .list()
      .then((res) => setOrgs(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdmin(user)) {
      router.push("/dashboard");
      return;
    }
    loadOrgs();
  }, [user, ready, router]);

  function startEdit(org: Organization) {
    setEditingId(org.id);
    setForm(orgToForm(org));
    setMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function field(
    key: keyof OrgPayload,
    label: string,
    opts?: { type?: string; rows?: number; span?: boolean }
  ) {
    const val = form[key];
    const isNum = key === "founded_year";
    return (
      <div className={opts?.span ? "sm:col-span-2" : ""}>
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {opts?.rows ? (
          <textarea
            value={(val as string) ?? ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            rows={opts.rows}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        ) : (
          <input
            type={opts?.type || "text"}
            value={isNum ? (val ?? "") : ((val as string) ?? "")}
            onChange={(e) =>
              setForm({
                ...form,
                [key]: isNum
                  ? e.target.value
                    ? Number(e.target.value)
                    : undefined
                  : e.target.value,
              })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        )}
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      if (editingId) {
        await orgApi.update(editingId, form);
        setMsg("Organization updated.");
      } else {
        await orgApi.create(form);
        setMsg("Organization created.");
      }
      cancelEdit();
      loadOrgs();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await orgApi.delete(id);
      setMsg("Organization deleted.");
      loadOrgs();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (!ready || loading) {
    return <p className="p-10 text-slate-500">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
        &larr; Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        Register &amp; Manage Organizations
      </h1>
      <p className="mt-1 text-slate-600">
        School admin: enter full organization details for the official campus directory.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900">
          {editingId ? "Edit organization profile" : "New organization registration"}
        </h2>
        {msg && <p className="mt-2 text-sm text-indigo-700">{msg}</p>}

        <p className="mt-4 text-xs font-semibold uppercase text-slate-500">
          Basic information
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          {field("name", "Organization name *", { span: true })}
          {field("category", "Category (e.g. Academic)")}
          {field("org_type", "Organization type")}
          {field("department", "College / department")}
          {field("founded_year", "Year founded", { type: "number" })}
          <div>
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="active">Active (recognized)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {field("description", "About / overview", { rows: 3, span: true })}
        </div>

        <p className="mt-6 text-xs font-semibold uppercase text-slate-500">
          Mission &amp; membership
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          {field("mission", "Mission", { rows: 2, span: true })}
          {field("vision", "Vision", { rows: 2, span: true })}
          {field("objectives", "Objectives (one per line)", { rows: 4, span: true })}
          {field("membership_requirements", "Membership requirements", {
            rows: 4,
            span: true,
          })}
        </div>

        <p className="mt-6 text-xs font-semibold uppercase text-slate-500">
          Campus contact &amp; schedule
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          {field("meeting_schedule", "Meeting schedule")}
          {field("office_location", "Office / room location")}
          {field("contact_email", "Contact email", { type: "email" })}
          {field("contact_phone", "Contact phone")}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {editingId ? "Save changes" : "Register organization"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="mt-8 space-y-3">
        {orgs.map((org) => (
          <li
            key={org.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <div>
              <p className="font-medium text-slate-900">{org.name}</p>
              <p className="text-xs text-slate-500">
                {org.org_type || org.category} · {org.department} · {org.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/organizations/${org.id}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
              >
                View
              </Link>
              <button
                onClick={() => startEdit(org)}
                className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs text-indigo-700 hover:bg-indigo-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(org.id, org.name)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
