import { POST as leadNotifyPost } from "@/app/api/lead-notify/route";

/** Alias ingest endpoint — same handler as lead-notify (intelligence pipeline). */
export const POST = leadNotifyPost;
