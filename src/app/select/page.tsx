import { signOut } from "@/auth";
import { getTranslations } from "@/lib/i18n";
import { requireAccessToken } from "@/lib/session";
import { listFolders } from "@/lib/drive";
import { HOME } from "@/lib/routes";
import { FolderList } from "@/components/select/folder-list";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const Page = async () => {
  const accessToken = await requireAccessToken();
  const [folders, { select }] = await Promise.all([
    listFolders(accessToken),
    getTranslations(),
  ]);

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: HOME });
  };

  return (
    <main
      data-testid="select-page"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6"
    >
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple">{select.title}</h1>
          <p className="text-comment">{select.subtitle}</p>
        </div>
        <form action={signOutAction}>
          <Button variant="ghost" type="submit">
            {select.signOut}
          </Button>
        </form>
      </header>

      {folders.length ? (
        <FolderList folders={folders} t={select} />
      ) : (
        <p className="text-comment">{select.empty}</p>
      )}
    </main>
  );
};

export default Page;
