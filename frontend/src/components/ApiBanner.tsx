"use client";

import { useEffect, useState } from "react";
import { checkApiHealth } from "@/lib/api";

export default function ApiBanner() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const ok = await checkApiHealth();
      if (!cancelled) setOnline(ok);
    }

    const t = setTimeout(check, 2000);
    const interval = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  if (online === null || online) return null;

  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950">
      Backend API is offline. Run start.bat or: cd backend → php artisan serve — then refresh{" "}
      <a href="/api/health" className="underline" target="_blank" rel="noreferrer">
        test API
      </a>
    </div>
  );
}
