import { google, type drive_v3 } from "googleapis";
import type { DriveFile, DriveFolder } from "@/types";

const FOLDER_MIME = "application/vnd.google-apps.folder";

const createClient = (accessToken: string) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth: authClient });
};

// Shared flags so queries also reach Shared Drives.
const sharedDriveParams = {
  includeItemsFromAllDrives: true,
  supportsAllDrives: true,
} as const;

/** Lists every child of a folder, following pagination to the end. */
const listChildren = async (drive: drive_v3.Drive, folderId: string) => {
  const children: drive_v3.Schema$File[] = [];
  let pageToken: string | undefined;

  do {
    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, webViewLink)",
      pageSize: 1000,
      orderBy: "folder,name",
      pageToken,
      ...sharedDriveParams,
    });
    if (data.files) children.push(...data.files);
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  return children;
};

/**
 * Top-level folders for the picker: folders in My Drive's root plus any
 * folders shared directly with the user, ordered by name.
 */
export const listFolders = async (
  accessToken: string,
): Promise<DriveFolder[]> => {
  const drive = createClient(accessToken);
  const folders: DriveFolder[] = [];
  let pageToken: string | undefined;

  do {
    const { data } = await drive.files.list({
      q: `mimeType = '${FOLDER_MIME}' and trashed = false and ('root' in parents or sharedWithMe = true)`,
      fields: "nextPageToken, files(id, name)",
      pageSize: 1000,
      orderBy: "name",
      pageToken,
      ...sharedDriveParams,
    });
    for (const { id, name } of data.files ?? []) {
      if (id && name) folders.push({ id, name });
    }
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  return folders;
};

/** Lists the direct subfolders of a folder, ordered by name (for the tree picker). */
export const listSubfolders = async (
  accessToken: string,
  parentId: string,
): Promise<DriveFolder[]> => {
  const drive = createClient(accessToken);
  const folders: DriveFolder[] = [];
  let pageToken: string | undefined;

  do {
    const { data } = await drive.files.list({
      q: `'${parentId}' in parents and mimeType = '${FOLDER_MIME}' and trashed = false`,
      fields: "nextPageToken, files(id, name)",
      pageSize: 1000,
      orderBy: "name",
      pageToken,
      ...sharedDriveParams,
    });
    for (const { id, name } of data.files ?? []) {
      if (id && name) folders.push({ id, name });
    }
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  return folders;
};

/**
 * Walks each selected folder's full subtree depth-first, emitting files
 * grouped by folder (files before descending into subfolders). Each file
 * carries its path relative to the selected root. Folder cycles created by
 * shortcuts are skipped via a visited set.
 */
export const scanFolders = async (
  accessToken: string,
  folderIds: string[],
): Promise<DriveFile[]> => {
  const drive = createClient(accessToken);
  const visited = new Set<string>();
  const files: DriveFile[] = [];

  const walk = async (folderId: string, parentPath: string) => {
    if (visited.has(folderId)) return;
    visited.add(folderId);

    const children = await listChildren(drive, folderId);
    const subfolders: { id: string; path: string }[] = [];

    for (const { id, name, mimeType, webViewLink } of children) {
      if (!id || !name) continue;
      const path = `${parentPath}/${name}`;
      if (mimeType === FOLDER_MIME) {
        subfolders.push({ id, path });
      } else {
        files.push({
          id,
          name,
          path,
          mimeType: mimeType ?? "",
          webViewLink: webViewLink ?? `https://drive.google.com/open?id=${id}`,
        });
      }
    }

    for (const { id, path } of subfolders) await walk(id, path);
  };

  for (const folderId of folderIds) {
    const { data } = await drive.files.get({
      fileId: folderId,
      fields: "id, name",
      ...sharedDriveParams,
    });
    await walk(folderId, data.name ?? folderId);
  }

  return files;
};
