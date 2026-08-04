export type StaffRole = "Admin" | "Staff";
export type StaffStatus = "Active" | "Pending";

export interface StaffMember {
  id: string;
  name: string | null; // Nullable because pending invites might only have an email
  email: string;
  role: StaffRole;
  status: StaffStatus;
  avatarUrl?: string;
}
