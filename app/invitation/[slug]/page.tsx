import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Invite from "@/lib/models/Invite";
import TemplateThreeWithBoot from "@/components/invitation/TemplateThreeWithBoot";
import type { WeddingData } from "@/components/type/wedding";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();
  const invite = await Invite.findOne({ slug });

  if (!invite) {
    notFound();
  }

  const weddingData: WeddingData = {
    names: "ሄኖክ ብርሀኔ & ፅዮን ገ/ትንሳኤ",
    weddingDate: "2026-08-24",
    location: "The Grand Ballroom, NY",
    guestName: invite.fullName,
    slug: invite.slug,
    status: invite.status,
    features: ["Open Bar", "Live Band", "Photo Booth"],
    images: [
      "https://images.unsplash.com/photo-1520856729845-cee33a465223?q=80&w=2070",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
    ],
  };

  return <TemplateThreeWithBoot data={weddingData} />;
}
