export const en = {
  common: {
    appName: "Drive to QR",
    back: "Back",
    loading: "Loading…",
  },
  home: {
    title: "Drive to QR",
    tagline:
      "Sign in with Google, pick Drive folders, and get a printable sheet of QR codes — one per file.",
    signIn: "Sign in with Google",
  },
  select: {
    title: "Select folders",
    subtitle: "Pick one or more folders. Their entire subtree will be scanned.",
    selectAll: "Select all",
    clear: "Clear",
    generate: "Generate QR codes",
    empty: "No folders found in your Drive.",
    selectedCount: "{count} selected",
    signOut: "Sign out",
    scanning: "Scanning folders…",
  },
  result: {
    title: "QR codes",
    columns: "Columns",
    size: "QR size",
    labelMode: "Label",
    labelPath: "Path",
    labelName: "Name",
    print: "Print",
    back: "Back to folders",
    empty: "No files found in the selected folders.",
    fileCount: "{count} files",
    editLabel: "Edit label",
    cropMarks: "Crop marks",
    include: "Include in print",
  },
};

export type Dict = typeof en;
