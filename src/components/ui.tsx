import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

const base =
  "inline-flex items-center justify-center gap-1.5 font-medium rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink/30";

const variants = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  secondary: "bg-white text-ink border border-stone-300 hover:bg-stone-50",
  ghost: "text-ink-soft hover:bg-stone-100",
  danger: "text-red-600 hover:bg-red-50",
};

const sizes = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
});

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: keyof typeof variants; size?: keyof typeof sizes }) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10",
          className,
        )}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10",
        className,
      )}
      {...props}
    />
  );
});

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone-400">{hint}</span>}
    </label>
  );
}
