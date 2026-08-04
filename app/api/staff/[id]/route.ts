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

  const body = await req.json();
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
      clerkResult = await clerk.organizations.deleteOrganizationMembership({
        organizationId: orgId!,
        userId: id,
      });
    } else if (result.data.mode === "revoke") {
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
      err instanceof Error ? err.message : "Failed to fetch staff";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
