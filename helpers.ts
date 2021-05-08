type ExtensionList = string[];
export const filterByExt = (allowedExtensions: ExtensionList) =>
  ({ name, isDirectory }: Deno.DirEntry) => {
    if (isDirectory) return false;
    const { ext } = parseFileName(name);
    return allowedExtensions.includes(ext.toLowerCase());
  };

export const parseFileName = (fullName: string) => {
  const baseName = fullName.split(".").slice(0, -1).join(".");
  const ext = fullName.split(".").slice(-1)[0];
  return { baseName, ext };
};

export const deleteFiles = (filesToDelete: string[]) =>
  filesToDelete.map((path) => Deno.remove(path));
