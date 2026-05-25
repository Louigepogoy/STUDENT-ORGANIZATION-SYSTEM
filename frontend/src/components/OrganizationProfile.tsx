import { Organization } from "@/lib/api";

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export default function OrganizationProfile({ org }: { org: Organization }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {org.category && (
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700">
            {org.category}
          </span>
        )}
        {org.org_type && (
          <span className="rounded-full bg-violet-50 px-3 py-0.5 text-xs font-medium text-violet-700">
            {org.org_type}
          </span>
        )}
        {org.department && (
          <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
            {org.department}
          </span>
        )}
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-medium ${
            org.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {org.status}
        </span>
      </div>

      {org.description && (
        <section>
          <h2 className="text-sm font-semibold text-slate-900">About</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">{org.description}</p>
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
        <DetailBlock label="Mission" value={org.mission} />
        <DetailBlock label="Vision" value={org.vision} />
      </section>

      <DetailBlock label="Objectives" value={org.objectives} />
      <DetailBlock
        label="Membership requirements"
        value={org.membership_requirements}
      />

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          School information
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <DetailBlock label="Founded" value={org.founded_year} />
          <DetailBlock label="Meeting schedule" value={org.meeting_schedule} />
          <DetailBlock label="Office / room" value={org.office_location} />
          <DetailBlock
            label="Faculty adviser"
            value={org.adviser?.name}
          />
          <DetailBlock label="Contact email" value={org.contact_email} />
          <DetailBlock label="Contact phone" value={org.contact_phone} />
          <DetailBlock
            label="Members"
            value={
              org.members_count != null
                ? `${org.members_count} approved member(s)`
                : undefined
            }
          />
        </dl>
      </section>
    </div>
  );
}
