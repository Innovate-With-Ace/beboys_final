import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/auth-guard";
import { StaffModeSchema, StaffRoleSchema } from "@/lib/schemas/staff";
import { clerkClient } from "@clerk/nextjs/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, orgId } = await validateUser(["org:admin"]);

  if (error) return error;

  const body = await req.json();
  const { id } = await params;
  const clerk = await clerkClient();

  const result = StaffRoleSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const roleToUpdate = result.data.role === "Admin" ? "org:admin" : "org:staff";

  try {
    const updatedMembership =
      await clerk.organizations.updateOrganizationMembership({
        organizationId: orgId!,
        userId: id!,
        role: roleToUpdate,
      });

    return NextResponse.json(
      { success: true, data: updatedMembership },
      { status: 200 },
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch staff";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, orgId, userId } = await validateUser(["org:admin"]);

  if (error) return error;

  // Safely parse body, handling cases where a body might be empty or missing for a delete request
  let body = {};
  try {
    body = await req.json();
  } catch {
    // Fallback if no body is sent
  }

  const result = StaffModeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const { id } = await params;
  const clerk = await clerkClient();

  try {
    let clerkResult;

    if (result.data.mode === "delete") {
      // Option A: If you want to completely delete the user account from Clerk.
      // Note: Clerk automatically removes memberships when a user is deleted,
      // but deleting the membership explicitly first or just deleting the user works.
      // It's safest to delete the membership first so you don't hit orphan/stale states.
      try {
        await clerk.organizations.deleteOrganizationMembership({
          organizationId: orgId!,
          userId: id,
        });
      } catch {
        // Ignore if membership was already gone, proceed to delete user
      }

      // Now delete the user account completely
      clerkResult = await clerk.users.deleteUser(id);
    } else if (result.data.mode === "revoke") {
      // Revoking a pending invitation
      clerkResult = await clerk.organizations.revokeOrganizationInvitation({
        invitationId: id,
        organizationId: orgId!,
        requestingUserId: userId!,
      });
    }

    return NextResponse.json(
      { success: true, data: clerkResult },
      { status: 200 },
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to process request";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
