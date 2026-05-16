import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invite from "@/lib/models/Invite";
import { requireAdminApi } from "@/lib/apiAuth";

/** Programmatic check-in (e.g. from admin UI). QR flow uses /admin/check-in/[slug]. */
export async function PATCH(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    await connectDB();
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const invite = await Invite.findOne({ slug });

    if (!invite) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    if (invite.isAdmin) {
      return NextResponse.json(
        { error: "Cannot check in an admin account via guest QR" },
        { status: 400 },
      );
    }

    const alreadyAttended = invite.status === "attended";

    if (!alreadyAttended) {
      invite.status = "attended";
      await invite.save();
    }

    return NextResponse.json({
      ...invite.toObject(),
      alreadyAttended,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
