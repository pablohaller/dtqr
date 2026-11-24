"use server";

import { requireAccessToken } from "@/lib/session";
import { listSubfolders } from "@/lib/drive";
import type { DriveFolder } from "@/types";

export const fetchSubfolders = async (
  parentId: string,
): Promise<DriveFolder[]> => {
  const accessToken = await requireAccessToken();
  return listSubfolders(accessToken, parentId);
};
