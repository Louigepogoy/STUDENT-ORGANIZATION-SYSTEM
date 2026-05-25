import { Membership, User } from "@/lib/api";

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isOfficer(user: User | null): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return (user.memberships ?? []).some(
    (m) =>
      m.status === "approved" &&
      ["officer", "president"].includes(m.role)
  );
}

export function isOfficerOf(user: User | null, organizationId: number): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return (user.memberships ?? []).some(
    (m) =>
      m.organization_id === organizationId &&
      m.status === "approved" &&
      ["officer", "president"].includes(m.role)
  );
}

export function officerOrganizations(
  user: User | null,
  memberships?: Membership[]
): Membership[] {
  const list = memberships ?? user?.memberships ?? [];
  return list.filter(
    (m) =>
      m.status === "approved" &&
      ["officer", "president"].includes(m.role)
  );
}

export function roleLabel(user: User | null): string {
    if (!user) return "";
    if (isAdmin(user)) return "Rey Inoc";
    if (isOfficer(user)) return "Louige Pogoy";
    return "Jemar Lee";
}
