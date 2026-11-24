import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "@/lib/i18n";
import { requireAccessToken } from "@/lib/session";
import { scanFolders } from "@/lib/drive";
import { SELECT } from "@/lib/routes";
import { QrSheet } from "@/components/result/qr-sheet";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ folder?: string | string[] }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const accessToken = await requireAccessToken();
  const { folder } = await searchParams;
  const folderIds = Array.isArray(folder) ? folder : folder ? [folder] : [];
  if (folderIds.length === 0) redirect(SELECT);

  const [files, { result }] = await Promise.all([
    scanFolders(accessToken, folderIds),
    getTranslations(),
  ]);

  if (files.length === 0) {
    return (
      <main
        data-testid="result-page"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-6"
      >
        <p className="text-comment">{result.empty}</p>
        <Link href={SELECT} className="text-cyan hover:underline">
          {result.back}
        </Link>
      </main>
    );
  }

  return <QrSheet files={files} t={result} />;
};

export default Page;
