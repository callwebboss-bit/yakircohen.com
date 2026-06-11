import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red font-semibold text-white shadow-sm hover:bg-brand-red-light active:bg-brand-red-dark",
  secondary:
    "border border-border bg-surface font-medium text-foreground hover:border-brand-red/40 hover:text-brand-red",
  outline:
    "border border-brand-red font-medium text-brand-red hover:bg-brand-red/10",
  ghost:
    "font-medium text-foreground hover:bg-brand-red/5 hover:text-brand-red",
};

// IMPROVED: min-h-11 touch target, active micro-interaction, ghost variant, external link support
const baseStyles = cn(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm",
  "transition-[transform,colors,background-color,border-color] duration-normal ease-luxury",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
  "active:scale-[0.98]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
  "disabled:pointer-events-none disabled:opacity-50",
);

type ButtonBaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps | "href"> & {
    as: "link";
    href: string;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps | "href"> & {
    as: "a";
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    className,
    children,
    as = "button",
    ...rest
  } = props;

  const classes = cn(baseStyles, variantStyles[variant], className);

  if (as === "link") {
    const { href, ...linkProps } = rest as Omit<ButtonAsLink, keyof ButtonBaseProps>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  if (as === "a") {
    const { href, ...anchorProps } = rest as Omit<ButtonAsAnchor, keyof ButtonBaseProps>;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as Omit<ButtonAsButton, keyof ButtonBaseProps>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
