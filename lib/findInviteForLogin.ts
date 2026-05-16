import Invite, { type IInvite } from "@/lib/models/Invite";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Case-insensitive name match; phone is optional and falls back to name-only. */
export async function findInviteForLogin(
  fullName: string,
  phoneNumber?: string,
): Promise<IInvite | null> {
  const namePattern = new RegExp(`^${escapeRegex(fullName.trim())}$`, "i");

  if (phoneNumber) {
    const withPhone = await Invite.findOne({ fullName: namePattern, phoneNumber });
    if (withPhone) return withPhone;
  }

  return Invite.findOne({ fullName: namePattern });
}
