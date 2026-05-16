/**
 * Create the first admin user in MongoDB (run once).
 *
 * Usage (from project root):
 *   MONGODB_URI="your-uri" node scripts/seed-admin.mjs
 *
 * Optional env:
 *   ADMIN_NAME="Henok Admin"
 *   ADMIN_PHONE="+251911000000"
 *   ADMIN_SLUG="henok-admin"
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)
if (!MONGODB_URI) {
  console.error("Set MONGODB_URI (same value as production).");
  process.exit(1);
}

const fullName = process.env.ADMIN_NAME || "Wedding Admin";
const phoneNumber = process.env.ADMIN_PHONE || "";
const slug =
  process.env.ADMIN_SLUG ||
  fullName
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const InviteSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    slug: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "attended"], default: "pending" },
    rsvpLink: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "invites" },
);

const Invite = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);

await mongoose.connect(MONGODB_URI);

const existing = await Invite.findOne({ isAdmin: true });
if (existing) {
  console.log("An admin already exists:");
  console.log(`  Name: ${existing.fullName}`);
  console.log(`  isAdmin: ${existing.isAdmin}`);
  console.log(`  slug: ${existing.slug}`);
  await mongoose.disconnect();
  process.exit(0);
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const rsvpLink = `${baseUrl.replace(/\/$/, "")}/admin/check-in/${slug}`;

const doc = await Invite.create({
  fullName,
  phoneNumber: phoneNumber || undefined,
  slug,
  isAdmin: true,
  status: "pending",
  rsvpLink,
});

console.log("Admin created successfully:");
console.log(`  fullName: ${doc.fullName}`);
console.log(`  phoneNumber: ${doc.phoneNumber || "(none)"}`);
console.log(`  slug: ${doc.slug}`);
console.log(`  isAdmin: ${doc.isAdmin}`);
console.log("\nSign in at /admin/login with the exact name above.");
if (phoneNumber) {
  console.log("If login fails, try leaving the phone field empty on the form.");
}

await mongoose.disconnect();
