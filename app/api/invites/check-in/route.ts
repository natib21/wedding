import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invite from '@/lib/models/Invite';

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const invite = await Invite.findOneAndUpdate(
      { slug },
      { status: 'attended' },
      { new: true }
    );

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    return NextResponse.json(invite);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
