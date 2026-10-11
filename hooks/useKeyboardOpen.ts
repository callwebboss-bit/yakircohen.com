"use client";

import { useSyncExternalStore } from "react";
import { getKeyboardSnapshot, subscribeKeyboard } from "@/lib/viewport-keyboard";

/** true כשמקלדת המסך פתוחה או שדה עריכה בפוקוס (מסך צר או מגע). */
export function useKeyboardOpen(): boolean {
  return useSyncExternalStore(subscribeKeyboard, getKeyboardSnapshot, () => false);
}
