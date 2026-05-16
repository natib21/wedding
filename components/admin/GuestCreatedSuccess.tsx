"use client";

import { motion } from "framer-motion";
import { Check, Copy, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { buildInvitationUrl } from "@/lib/inviteLinks";

export type CreatedGuest = {
  fullName: string;
  slug: string;
  rsvpLink?: string;
};

type GuestCreatedSuccessProps = {
  guest: CreatedGuest;
  onDone: () => void;
};

export default function GuestCreatedSuccess({ guest, onDone }: GuestCreatedSuccessProps) {
  const checkInUrl =
    guest.rsvpLink || `${window.location.origin}/admin/check-in/${guest.slug}`;
  const publicUrl = buildInvitationUrl(guest.slug, window.location.origin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-8 px-2 overflow-y-auto max-h-[75vh]"
    >
      <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
        <Check className="size-8 text-emerald-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-1">Invitation Created!</h3>
      <p className="text-slate-400 text-sm text-center mb-6">
        {guest.fullName} — share the public link or print the gatekeeper QR.
      </p>

      <div className="w-full rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <QrCode className="size-3.5" />
          Gatekeeper QR (admin scan only)
        </p>
        <div className="bg-white p-4 rounded-xl flex justify-center">
          <QRCode value={checkInUrl} size={180} level="H" />
        </div>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(checkInUrl);
            toast.success("Check-in link copied");
          }}
          className="mt-3 w-full text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1"
        >
          <Copy className="size-3.5" />
          Copy check-in URL
        </button>
      </div>

      <div className="w-full rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 mb-6">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Public invitation link</p>
        <p className="text-xs text-slate-300 break-all mb-3">{publicUrl}</p>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(publicUrl);
            toast.success("Invitation link copied");
          }}
          className="w-full text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1"
        >
          <Copy className="size-3.5" />
          Copy public link
        </button>
      </div>

      <Button onClick={onDone} className="w-full bg-indigo-600 hover:bg-indigo-500">
        Done
      </Button>
    </motion.div>
  );
}
