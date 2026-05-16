import connectDB from "@/lib/mongodb";
import Invite from "@/lib/models/Invite";
import { requireAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import CheckInResult from "@/components/admin/CheckInResult";

export default async function AdminCheckInPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await requireAdminSession();

  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(`/admin/check-in/${slug}`)}`);
  }

  await connectDB();
  const guest = await Invite.findOne({ slug });

  if (!guest) {
    return (
      <CheckInResult
        type="error"
        message="Guest not found. This QR code may be invalid or expired."
      />
    );
  }

  if (guest.isAdmin) {
    return (
      <CheckInResult
        type="error"
        message="This QR code is for admin accounts only and cannot be used for guest check-in."
      />
    );
  }

  const alreadyAttended = guest.status === "attended";

  if (!alreadyAttended) {
    guest.status = "attended";
    await guest.save();
  }

  return (
    <CheckInResult
      type="success"
      guestName={guest.fullName}
      alreadyAttended={alreadyAttended}
    />
  );
}
