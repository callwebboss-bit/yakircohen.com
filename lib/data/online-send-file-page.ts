/** טופס אישור הצהרת אחריות ותנאי שירות */
export const ONLINE_LIABILITY_FORM_URL =
  "https://forms.gle/ytdrFheSueqMXvqb8";

export const ONLINE_LIABILITY_COMMITMENTS: readonly {
  title: string;
  body: string;
}[] = [
  {
    title: "חוק האזנת סתר",
    body: "ההקלטה בוצעה כחוק. הייתי צד פעיל בשיחה או שקיבלתי הסכמה מפורשת מכל המשתתפים.",
  },
  {
    title: "זכויות יוצרים",
    body: "החומרים (וידאו/אודיו/תמונות) בבעלותי או שיש לי רישיון שימוש חוקי בהם.",
  },
  {
    title: "שחרור מאחריות",
    body: "אני משחרר את האולפן מכל תביעה או נזק הקשור לתוכן ההקלטה או לשימוש בה. האולפן משמש כזרוע ביצועית טכנית בלבד.",
  },
] as const;
