import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { getTranslations } from "@/lib/i18n";
import { SELECT } from "@/lib/routes";
import { SignInButton } from "@/components/home/sign-in-button";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth();
  if (session?.accessToken && !session.error) redirect(SELECT);

  const { home } = await getTranslations();

  const signInAction = async () => {
    "use server";
    await signIn("google", { redirectTo: SELECT });
  };

  return (
    <main
      data-testid="home"
      className="flex flex-1 flex-col items-center justify-center gap-8 p-8 text-center"
    >
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl font-bold text-purple">{home.title}</h1>
        <p className="text-lg text-comment">{home.tagline}</p>
      </div>
      <SignInButton action={signInAction} label={home.signIn} />
    </main>
  );
};

export default Page;
