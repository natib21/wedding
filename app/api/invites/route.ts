import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invite from '@/lib/models/Invite';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    await connectDB();
    const invites = await Invite.find({}).sort({ createdAt: -1 });
    return NextResponse.json(invites);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, phoneNumber } = body;

    if (!fullName || !phoneNumber) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Generate a simple slug from name or use a random one if name exists
    let slug = fullName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // Check if slug exists
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
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Guest already registered' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
