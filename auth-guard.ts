import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function validateUser(allowedRoles?: string[]) {
  const { userId, orgRole } = await auth();

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      userId: null,
      orgRole: null,
    };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!orgRole || !allowedRoles.includes(orgRole)) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        userId: null,
        orgRole: null,
      };
    }
  }

  return { error: null, userId, orgRole };
}
