import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/auth-guard";
import { StaffPayloadSchema } from "@/lib/schemas/staff";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { error, userId, orgId } = await validateUser(["org:admin"]);

  if (error) {
    return error;
  }

  const body = await req.json();
  const result = StaffPayloadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, role } = result.data;
  const validatedRole = role === "Admin" ? "org:admin" : "org:staff";

  try {
    const clerk = await clerkClient();

    const invitation = await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId!,
      inviterUserId: userId!,
      emailAddress: email,
      role: validatedRole,
      expiresInDays: 3,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invite`,
    });

    return NextResponse.json({ success: true, invitation }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to send invitation";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  const { error, orgId } = await validateUser(["org:admin"]);

  if (error) {
    return error;
  }

  try {
    const clerk = await clerkClient();

    const memberships = await clerk.organizations.getOrganizationMembershipList(
      {
        organizationId: orgId!,
      },
    );

    const invitations = await clerk.organizations.getOrganizationInvitationList(
      {
        organizationId: orgId!,
        status: ["pending"],
      },
    );

    const formattedMembers = memberships.data.map((membership) => {
      const user = membership.publicUserData;
      const roleName = membership.role === "org:admin" ? "Admin" : "Staff";

      return {
        id: membership.id,
        name: user
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : null,
        email: user?.identifier || "",
        role: roleName,
        status: "Active" as const,
        avatarUrl: user?.imageUrl,
        userID: user?.userId,
      };
    });

    const formattedInvitations = invitations.data.map((invitation) => {
      const metadata = invitation.publicMetadata as Record<string, unknown>;
      const roleName = invitation.role === "org:admin" ? "Admin" : "Staff";

      return {
        id: invitation.id,
        name: null,
        email: invitation.emailAddress,
        role: roleName,
        userID:
          typeof metadata?.userId === "string" ? metadata.userId : undefined,
        status: "Pending" as const,
        avatarUrl: undefined,
      };
    });

    const dataToReturn = [...formattedMembers, ...formattedInvitations];

    return NextResponse.json(dataToReturn, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch staff";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
