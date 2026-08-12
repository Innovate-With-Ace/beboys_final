import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) {
    return Response.json({ error: "UserId is required" }, { status: 400 });
  }

  const clerk = await clerkClient();

  try {
    await clerk.organizations.createOrganizationMembership({
      organizationId: process.env.BEBOYS_ORG_ID!,
      userId: userId,
      role: "org:customer",
    });
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err }, { status: 400 });
  }
}
