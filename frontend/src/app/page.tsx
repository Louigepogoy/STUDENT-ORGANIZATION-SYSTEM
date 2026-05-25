import Link from "next/link";
import {
  membershipProcess,
  organizationTypes,
  systemFeatures,
  systemImportance,
} from "@/lib/school-content";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-8 py-14 text-white shadow-xl">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-200">
          Official campus student affairs platform
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Student Organization System
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-indigo-100 leading-relaxed">
          A centralized school system to register organizations, document missions
          and membership, schedule events, and keep every student informed about
          campus life.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/organizations"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow hover:bg-indigo-50"
          >
            Browse Organizations
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
          >
            Learn Why It Matters
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">
          {systemImportance.title}
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 leading-relaxed">
          {systemImportance.intro}
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {systemImportance.benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-indigo-900">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Types of student organizations in school
        </h2>
        <p className="mt-2 text-slate-600">
          Each group serves a different role in campus life. Browse by category to
          find where you fit.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Type</th>
                <th className="pb-3 pr-4 font-semibold">Examples</th>
                <th className="pb-3 font-semibold">Role on campus</th>
              </tr>
            </thead>
            <tbody>
              {organizationTypes.map((row) => (
                <tr key={row.type} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {row.type}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{row.examples}</td>
                  <td className="py-3 text-slate-600">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">
          How membership works
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
          {membershipProcess.map((step) => (
            <li
              key={step.step}
              className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {step.step}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Organizations",
            desc: "Full profiles: mission, vision, requirements, adviser, and contact details.",
            href: "/organizations",
          },
          {
            title: "Events",
            desc: "General assemblies, trainings, competitions, and service activities.",
            href: "/events",
          },
          {
            title: "Announcements",
            desc: "Enrollment drives, elections, and official notices from officers.",
            href: "/announcements",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16 rounded-2xl bg-slate-900 px-8 py-10 text-white">
        <h2 className="text-xl font-bold">What this system manages</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {systemFeatures.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-slate-300">
              <span className="text-emerald-400">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/about"
          className="mt-6 inline-block text-sm font-medium text-indigo-300 hover:text-white"
        >
          Read full guide for students, officers &amp; advisers →
        </Link>
      </section>
    </div>
  );
}
