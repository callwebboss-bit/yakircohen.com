"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  dismissPopup,
  getPopupServerSnapshot,
  getPopupSnapshot,
  popupKey,
  registerPopup,
  releasePopup,
  subscribePopups,
  type PopupId,
  type PopupMode,
} from "@/lib/popup-manager";

type UsePopupSlotOptions = {
  /** false = לא מועמד (עמוד מוחרג, אין מה להציג). */
  enabled: boolean;
  /** גבוה גובר כששני פופאפים ממתינים לאותו שער. */
  priority: number;
  /** סגירה ספציפית לפריט, למשל טיוטה מסוימת. בלי זה הסגירה היא לכל הפופאפ. */
  scope?: string;
  mode?: PopupMode;
};

/**
 * הרכיב מציג את עצמו רק כש-`visible` נכון. כל הכללים (זמן, גלילה, אחד לביקור,
 * מילוי טופס, סגירה ל-30 יום) חיים ב-lib/popup-manager.ts.
 */
export function usePopupSlot(
  id: PopupId,
  { enabled, priority, scope, mode = "eligible" }: UsePopupSlotOptions,
) {
  const snapshot = useSyncExternalStore(
    subscribePopups,
    getPopupSnapshot,
    getPopupServerSnapshot,
  );

  useEffect(() => {
    if (!enabled) return undefined;
    return registerPopup({ id, scope, priority, mode });
  }, [enabled, id, scope, priority, mode]);

  const dismiss = useCallback(() => dismissPopup(id, scope), [id, scope]);
  const release = useCallback(() => releasePopup(id, scope), [id, scope]);

  const key = popupKey(id, scope);
  return {
    /** הפופאפ הפעיל, ולא מוסתר כרגע בגלל מילוי טופס במובייל */
    visible: snapshot.activeKey === key && !snapshot.suppressed,
    /** הפופאפ הפעיל, כולל כשהוא מוסתר זמנית. שימושי לניקוי פוקוס ומדידה. */
    owned: snapshot.activeKey === key,
    dismiss,
    release,
  };
}
