"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckInResultProps =
  | {
      type: "success";
      guestName: string;
      alreadyAttended: boolean;
    }
  | {
      type: "error";
      message: string;
    };

export default function CheckInResult(props: CheckInResultProps) {
  const router = useRouter();

  useEffect(() => {
    if (props.type !== "success") return;
    const timer = window.setTimeout(() => router.push("/admin"), 3500);
    return () => window.clearTimeout(timer);
  }, [props.type, router]);

  if (props.type === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-slate-950 flex items-center justify-center p-6"
      >
        <motion.div className="max-w-md w-full text-center rounded-3xl border border-red-500/20 bg-slate-900/80 p-10">
          <div className="mx-auto mb-6 size-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="size-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Check-in failed</h1>
          <p className="text-slate-400 mb-8">{props.message}</p>
          <Button
            onClick={() => router.push("/admin")}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
          >
            Back to dashboard
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-slate-950 flex items-center justify-center p-6"
    >
      <motion.div className="max-w-md w-full text-center rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-10">
        <div className="mx-auto mb-6 size-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          {props.alreadyAttended ? (
            <UserCheck className="size-10 text-emerald-400" />
          ) : (
            <CheckCircle2 className="size-10 text-emerald-400" />
          )}
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">
          {props.alreadyAttended ? "Already checked in" : "Welcome!"}
        </h1>
        <p className="text-lg text-emerald-300 mb-2">{props.guestName}</p>
        <p className="text-slate-400 text-sm mb-8">
          {props.alreadyAttended
            ? "This guest was already marked as attended."
            : "Guest successfully marked as attended."}
        </p>
        <p className="text-xs text-slate-500 mb-4">Redirecting to dashboard…</p>
        <Button
          onClick={() => router.push("/admin")}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Go to dashboard now
        </Button>
      </motion.div>
    </motion.div>
  );
}
