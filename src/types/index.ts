export type ActionResult<T = undefined> =
  | { success: string; data?: T }
  | { error: string };

export type DriveFolder = {
  id: string;
  name: string;
};

export type DriveFile = {
  id: string;
  name: string;
  path: string;
  webViewLink: string;
  mimeType: string;
};

export type LabelMode = "path" | "name";
