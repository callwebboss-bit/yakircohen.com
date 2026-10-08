import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";

type WeddingPhotoTestimonialsProps = {
  className?: string;
};

/*
 * החלטת הבעלים 8.10.2026, בדיקת ההמלצות: שלוש ההמלצות שהוצגו כאן הוסרו (אין
 * להן מקור ציבורי), יחד עם חמשת הכוכבים שעמדו מעליהן. במקומן דירוג Google
 * וקישור לביקורות עצמן. הכותרת הייתה "מה הזוגות אומרים", אבל הדירוג הוא של
 * העסק כולו ולא של זוגות או של צילום בלבד, ולכן היא כללית עכשיו.
 */
export default function WeddingPhotoTestimonials({
  className,
}: WeddingPhotoTestimonialsProps) {
  return (
    <section
      className={className}
      aria-labelledby="wedding-testimonials-heading"
    >
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="wedding-testimonials-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מה הלקוחות אומרים
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          הביקורות שלקוחות כתבו עלינו נמצאות ב-Google Maps, על כל השירותים יחד
          ולא רק על צילום.
        </p>
      </header>
      <div className="mt-6 flex justify-center">
        <GoogleRatingBadge variant="compact" />
      </div>
    </section>
  );
}
