import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invite from '@/lib/models/Invite';

export async function GET() {
  try {
    await connectDB();
    const invites = await Invite.find({}).sort({ createdAt: -1 });
    return NextResponse.json(invites);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, phoneNumber } = body;

    if (!fullName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let slug = fullName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const existingSlug = await Invite.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const newInvite = await Invite.create({
      fullName,
      phoneNumber,
      slug,
      status: 'pending'
    });

    return NextResponse.json(newInvite, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ error: 'Guest already registered' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Add these to your existing /api/invites/route.ts or create a dynamic route at /api/invites/[id]/route.ts

/**
 * UPDATE: Modify guest details or toggle attendance status
 */
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    // Handle slug regeneration if name changes, similar to your POST logic
    if (updateData.fullName) {
      updateData.slug = updateData.fullName
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    const updatedInvite = await Invite.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedInvite) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json(updatedInvite);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE: Remove a guest from the registry
 */
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const deletedInvite = await Invite.findByIdAndDelete(id);

    if (!deletedInvite) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Guest removed successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Deletion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
