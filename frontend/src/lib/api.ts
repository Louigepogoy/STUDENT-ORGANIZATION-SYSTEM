const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function getApiBase(): string {
  return API_BASE.replace(/\/$/, "");
}

const FETCH_TIMEOUT_MS = 8000;

export type User = {
  id: number;
  name: string;
  email: string;
  student_id?: string;
  role: string;
  memberships?: Membership[];
};

export type Organization = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  org_type?: string;
  department?: string;
  founded_year?: number;
  mission?: string;
  vision?: string;
  objectives?: string;
  membership_requirements?: string;
  meeting_schedule?: string;
  office_location?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  members_count?: number;
  adviser?: User;
  memberships?: Membership[];
  events?: Event[];
  announcements?: Announcement[];
};

export type Membership = {
  id: number;
  user_id: number;
  organization_id: number;
  role: string;
  status: string;
  message?: string;
  user?: User;
  organization?: Organization;
};

export type Event = {
  id: number;
  organization_id: number;
  title: string;
  description?: string;
  location?: string;
  starts_at: string;
  ends_at?: string;
  status: string;
  organization?: Organization;
  creator?: User;
};

export type Announcement = {
  id: number;
  organization_id: number;
  title: string;
  body: string;
  is_pinned: boolean;
  created_at: string;
  organization?: Organization;
  author?: User;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${getApiBase()}/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  const apiBase = getApiBase();

  try {
    res = await fetch(`${apiBase}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `API request timed out. Start the backend: cd backend → php artisan serve`
      );
    }
    throw new Error(
      `Cannot reach the API. Start Laravel (port 8000), then refresh http://localhost:3000`
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        (data as { message?: string }).message || "Resource not found"
      );
    }
    const message =
      (data as { message?: string }).message ||
      ((data as { errors?: Record<string, string[]> }).errors &&
        Object.values(
          (data as { errors: Record<string, string[]> }).errors
        ).flat().join(", ")) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ user: User; token: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    student_id?: string;
  }) =>
    api<{ user: User; token: string }>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () => api<{ message: string }>("/logout", { method: "POST" }),
  me: () => api<User>("/me"),
};

export type OrgPayload = {
  name: string;
  description?: string;
  category?: string;
  org_type?: string;
  department?: string;
  founded_year?: number;
  mission?: string;
  vision?: string;
  objectives?: string;
  membership_requirements?: string;
  meeting_schedule?: string;
  office_location?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
};

export const orgApi = {
  list: (params?: { search?: string; category?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.category) q.set("category", params.category);
    if (params?.page) q.set("page", String(params.page));
    const qs = q.toString();
    return api<Paginated<Organization>>(`/organizations${qs ? `?${qs}` : ""}`);
  },
  get: (id: number) => api<Organization>(`/organizations/${id}`),
  create: (payload: OrgPayload) =>
    api<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: Partial<OrgPayload>) =>
    api<Organization>(`/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: number) =>
    api<{ message: string }>(`/organizations/${id}`, { method: "DELETE" }),
  join: (id: number, message?: string) =>
    api<Membership>(`/organizations/${id}/join`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

export const membershipApi = {
  mine: () => api<Membership[]>("/my-memberships"),
  pending: (orgId: number) =>
    api<Membership[]>(`/organizations/${orgId}/memberships/pending`),
  update: (id: number, status: "approved" | "rejected", role?: string) =>
    api<Membership>(`/memberships/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, role }),
    }),
};

export type EventPayload = {
  organization_id: number;
  title: string;
  description?: string;
  location?: string;
  starts_at: string;
  ends_at?: string;
};

export const eventApi = {
  list: (params?: { organization_id?: number; upcoming?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.organization_id)
      q.set("organization_id", String(params.organization_id));
    if (params?.upcoming) q.set("upcoming", "1");
    const qs = q.toString();
    return api<Paginated<Event>>(`/events${qs ? `?${qs}` : ""}`);
  },
  create: (payload: EventPayload) =>
    api<Event>("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export type AnnouncementPayload = {
  organization_id: number;
  title: string;
  body: string;
  is_pinned?: boolean;
};

export const announcementApi = {
  list: (params?: { organization_id?: number }) => {
    const q = new URLSearchParams();
    if (params?.organization_id)
      q.set("organization_id", String(params.organization_id));
    const qs = q.toString();
    return api<Paginated<Announcement>>(
      `/announcements${qs ? `?${qs}` : ""}`
    );
  },
  create: (payload: AnnouncementPayload) =>
    api<Announcement>("/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
