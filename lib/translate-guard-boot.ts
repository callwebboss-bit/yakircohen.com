/**
 * תרגום אוטומטי של כרום (החלטת הבעלים 11.10.2026: לא מתרגמים את האתר, אבל
 * גולש שמתרגם לרוסית או לאנגלית צריך אתר שעובד).
 *
 * כרום מחליף צמתי טקסט בתגי <font> כשהוא מתרגם. React מחזיק הפניה לצומת
 * המקורי, ובעדכון הבא removeChild או insertBefore זורקים NotFoundError,
 * וחלקים אינטראקטיביים (אשף ההזמנה, מחשבונים) קורסים. React לא תיקנה את זה
 * (github.com/facebook/react/issues/11538, נסגר בדצמבר 2025), והמעקף שהציע שם
 * המתחזק הוא לעטוף את שתי המתודות ולא לזרוק כשהצומת כבר לא במקומו.
 *
 * כאן העטיפה פעילה רק כשהעמוד באמת מתורגם: כרום מוסיף ל-<html> את המחלקה
 * translated-ltr או translated-rtl (ctrl.blog/entry/detect-machine-translated-webpages).
 * בלי תרגום ההתנהגות זהה למקור, כך ששגיאה אמיתית בפיתוח עדיין נזרקת.
 */
export const TRANSLATE_GUARD_BOOT_SCRIPT =
  `(function(){try{if(typeof Node!=="function"||!Node.prototype)return;` +
  `var h=document.documentElement;` +
  `function t(){return h.classList.contains("translated-ltr")||h.classList.contains("translated-rtl")}` +
  `var r=Node.prototype.removeChild;` +
  `Node.prototype.removeChild=function(c){if(c&&c.parentNode!==this&&t())return c;return r.apply(this,arguments)};` +
  `var i=Node.prototype.insertBefore;` +
  `Node.prototype.insertBefore=function(n,f){if(f&&f.parentNode!==this&&t())return n;return i.apply(this,arguments)}` +
  `}catch(e){}})();`;
