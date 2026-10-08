"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import {
  drawVoucherImage,
  saveVoucherImage,
  VOUCHER_IMAGE_SIZE,
  type VoucherImageInput,
} from "@/lib/gift-voucher-canvas";

/**
 * תמונת השובר הסופית, עם הקוד והברקוד, מצוירת בדפדפן מהרשומה. הלקוח או יקיר
 * מורידים אותה מדף השובר, בלי צעד ידני נוסף אחרי ההנפקה.
 */
export default function VoucherImageButton({
  input,
  filename,
}: {
  input: VoucherImageInput;
  filename: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  async function handleClick() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setError(false);
    try {
      await drawVoucherImage(canvas, input);
      await saveVoucherImage(canvas, filename);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="mt-8">
      <canvas
        ref={canvasRef}
        width={VOUCHER_IMAGE_SIZE.width}
        height={VOUCHER_IMAGE_SIZE.height}
        className="hidden"
        aria-hidden
      />
      <Button type="button" variant="secondary" onClick={handleClick}>
        הורדת תמונת השובר
      </Button>
      {error ? (
        <p className="mt-3 text-sm text-brand-red-text" role="alert">
          לא הצלחנו ליצור את התמונה בדפדפן הזה. נסו דפדפן אחר.
        </p>
      ) : null}
    </div>
  );
}
