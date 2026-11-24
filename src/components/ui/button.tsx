import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
};

const variants = {
  primary:
    "bg-purple text-background hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-cyan hover:bg-current-line disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

export const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => (
  <button
    className={`rounded-lg px-5 py-2.5 font-semibold transition ${variants[variant]} ${className}`}
    {...props}
  />
);
