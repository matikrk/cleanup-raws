type ExtensionList = string[];
export function filterByExt(allowedExtensions: ExtensionList) {
  return ({ name, isDirectory }: Deno.DirEntry) => {
    if (isDirectory) return false;
    const { ext } = parseFileName(name);
    return allowedExtensions.includes(ext.toLowerCase());
  };
}

export function parseFileName(fullName: string) {
  const baseName = fullName.split(".").slice(0, -1).join(".");
  const ext = fullName.split(".").slice(-1)[0];
  return { baseName, ext };
}

export function deleteFiles(filesToDelete: string[]) {
  return filesToDelete.map((path) => Deno.remove(path));
}
