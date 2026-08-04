import { z } from "zod";

export const StaffPayloadSchema = z.object({
  email: z.email(),
  role: z.enum(["Staff", "Admin"]),
});

export const StaffRoleSchema = z.object({
  role: z.enum(["Staff", "Admin"]),
});

// Use for removing/revoking invitions for user
export const StaffModeSchema = z.object({
  mode: z.enum(["delete", "revoke"]),
});
