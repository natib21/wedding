import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invite from "@/lib/models/Invite";
import { requireAdminApi } from "@/lib/apiAuth";
import { buildCheckInUrl, getRequestOrigin } from "@/lib/inviteLinks";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    await connectDB();
    const invites = await Invite.find({}).sort({ createdAt: -1 });
    return NextResponse.json(invites);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    await connectDB();
    const body = await request.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phoneNumber =
      typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : undefined;
    const isAdmin = Boolean(body.isAdmin);

    if (!fullName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let slug = fullName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const existingSlug = await Invite.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const origin = getRequestOrigin(request);
    const rsvpLink = buildCheckInUrl(slug, origin);

    const newInvite = await Invite.create({
      fullName,
      phoneNumber,
      slug,
      isAdmin,
      status: "pending",
      rsvpLink,
    });

    return NextResponse.json(newInvite, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "Guest already registered" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    }

    if (updateData.fullName) {
      updateData.slug = updateData.fullName
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const origin = getRequestOrigin(request);
    if (updateData.slug) {
      updateData.rsvpLink = buildCheckInUrl(updateData.slug, origin);
    }

    const updatedInvite = await Invite.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedInvite) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json(updatedInvite);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    }

    const deletedInvite = await Invite.findByIdAndDelete(id);

    if (!deletedInvite) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Guest removed successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Deletion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
