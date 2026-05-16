import { notFound } from "next/navigation";
import { headers } from "next/headers";
import connectDB from "@/lib/mongodb";
import Invite from "@/lib/models/Invite";
import TemplateThreeWithBoot from "@/components/invitation/TemplateThreeWithBoot";
import type { WeddingData } from "@/components/type/wedding";
import { DEFAULT_WEDDING_VENUE } from "@/lib/weddingVenue";
import { buildCheckInUrl } from "@/lib/inviteLinks";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") ?? "https";
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    (host ? `${proto}://${host}` : "http://localhost:3000");

  await connectDB();
  const invite = await Invite.findOne({ slug });

  if (!invite) {
    notFound();
  }

  const weddingData: WeddingData = {
    names: "ሄኖክ ብርሀኔ & ፅዮን ገ/ትንሳኤ",
    weddingDate: "2026-08-24",
    location: DEFAULT_WEDDING_VENUE.location,
    locationName: DEFAULT_WEDDING_VENUE.locationName,
    coordinates: DEFAULT_WEDDING_VENUE.coordinates,
    guestName: invite.fullName,
    slug: invite.slug,
    status: invite.status,
    features: ["Open Bar", "Live Band", "Photo Booth"],
    images: [
      "https://images.unsplash.com/photo-1520856729845-cee33a465223?q=80&w=2070",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
    ],
    rsvpLink: invite.rsvpLink ?? buildCheckInUrl(invite.slug, origin),
  };

  return <TemplateThreeWithBoot data={weddingData} />;
}
