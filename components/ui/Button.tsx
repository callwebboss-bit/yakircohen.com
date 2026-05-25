import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red font-medium text-white hover:bg-brand-red-light",
  secondary:
    "border border-border bg-surface text-foreground hover:border-brand-red/40 hover:text-brand-red",
  outline:
    "border border-brand-red text-brand-red hover:bg-brand-red/10",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm transition-colors duration-normal ease-luxury focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:pointer-events-none disabled:opacity-50";

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

export type ButtonProps = ButtonAsButton | ButtonAsLink;

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

  const buttonProps = rest as Omit<ButtonAsButton, keyof ButtonBaseProps>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
