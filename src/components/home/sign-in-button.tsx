"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SignInButtonProps = {
  action: () => Promise<void>;
  label: string;
};

const Submit = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {label}
    </Button>
  );
};

export const SignInButton = ({ action, label }: SignInButtonProps) => (
  <form action={action} data-testid="sign-in-button">
    <Submit label={label} />
  </form>
);
