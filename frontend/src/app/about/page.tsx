import Link from "next/link";
import {
  membershipProcess,
  organizationTypes,
  schoolPolicies,
  systemFeatures,
  systemImportance,
} from "@/lib/school-content";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        &larr; Home
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        Student Organizations in School
      </h1>
      <p className="mt-3 text-lg text-slate-600 leading-relaxed">
        A complete guide to what student organizations are, why schools maintain
        them, and how this system supports official campus operations.
      </p>

      <article className="prose prose-slate mt-10 max-w-none">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mt-0">
            What is a student organization?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            A student organization is a formal group recognized by the school,
            usually composed of enrolled students with a defined purpose, constitution,
            set of officers, and a faculty adviser. Organizations are not informal
            friend groups—they are registered with the Office of Student Affairs (or
            equivalent) and must follow school policies on activities, finances, and
            conduct.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Examples include academic societies, the student council, cultural clubs,
            sports teams, volunteer corps, and faith-based groups. Each org contributes
            to holistic education by developing leadership, discipline, and community
            involvement outside regular classes.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            {systemImportance.title}
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {systemImportance.intro}
          </p>
          <div className="mt-6 space-y-4">
            {systemImportance.benefits.map((b, i) => (
              <div
                key={b.title}
                className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{b.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Organization types on campus
          </h2>
          <ul className="mt-4 space-y-4">
            {organizationTypes.map((t) => (
              <li key={t.type} className="border-b border-slate-100 pb-4 last:border-0">
                <p className="font-semibold text-indigo-900">{t.type}</p>
                <p className="text-sm text-slate-500">Examples: {t.examples}</p>
                <p className="mt-1 text-sm text-slate-600">{t.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Standard membership process
          </h2>
          <ol className="mt-4 space-y-3">
            {membershipProcess.map((s) => (
              <li
                key={s.step}
                className="rounded-xl border border-indigo-100 bg-indigo-50/30 px-4 py-3"
              >
                <span className="font-semibold text-indigo-900">
                  Step {s.step}: {s.title}
                </span>
                <p className="mt-1 text-sm text-slate-600">{s.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-8">
          <h2 className="text-xl font-bold text-amber-900">
            School policies (typical)
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Policies vary by institution; these are common expectations for
            recognized organizations.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {schoolPolicies.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Role of this Student Organization System
          </h2>
          <p className="text-slate-600 leading-relaxed">
            This web application replaces scattered spreadsheets and paper forms
            with one official platform where students, officers, advisers, and
            administrators can work together.
          </p>
          <ul className="mt-4 space-y-2">
            {systemFeatures.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-slate-700">
                <span className="text-emerald-600">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl bg-indigo-600 px-8 py-8 text-white">
          <h2 className="text-xl font-bold">Ready to participate?</h2>
          <p className="mt-2 text-indigo-100">
            Browse registered organizations, read their full school profiles, and
            apply for membership online.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/organizations"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700"
            >
              View organizations
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-white/50 px-5 py-2.5 text-sm font-semibold"
            >
              Create student account
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
