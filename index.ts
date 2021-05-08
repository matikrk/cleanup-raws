import { parse } from "https://deno.land/std/flags/mod.ts";
const { dir: jpgDirUrl = "./", rawDir: rawDirUrl = jpgDirUrl, dryRun = false } =
  parse(Deno.args);

const jpgDir = Deno.readDirSync(jpgDirUrl);

console.log("jpgDirUrl", jpgDirUrl);
console.log("rawDirUrl", rawDirUrl);

const rawDir = Deno.readDirSync(rawDirUrl);

type ExtensionList = string[];
const rawExtensions = ["orf", "dng"];
const jpgExtensions = ["jpg", "jpegs"];

const filterByExt = (allowedExtensions: ExtensionList) =>
  ({ name, isDirectory }: Deno.DirEntry) => {
    if (isDirectory) return false;
    const ext = name.split(".").pop() || "";
    return allowedExtensions.includes(ext.toLowerCase());
  };

const parseFileName = (fullName: string) => {
  const baseName = fullName.split(".").slice(0, -1).join(".");
  const ext = fullName.split(".").slice(-1)[0];
  return { baseName, ext };
};
const jpgList = [...jpgDir].filter(filterByExt(jpgExtensions));
const rawList = [...rawDir].filter(filterByExt(rawExtensions));
const jpgNames = new Set(
  jpgList.map(({ name }) => parseFileName(name).baseName),
);

const rawToDelete = rawList.filter(({ name }) =>
  !jpgNames.has(parseFileName(name).baseName)
);
const filesToDelete = rawToDelete.map(({ name }) => `${rawDirUrl}/${name}`);

const deleteFiles = (filesToDelete: string[]) =>
  filesToDelete.map((path) => Deno.remove(path));

if (dryRun) {
  console.log("filesToDelete", filesToDelete.length);
  console.log(JSON.stringify(filesToDelete, null, 2));
} else {
  await Promise.all(deleteFiles(filesToDelete));
  console.log(`deleted ${filesToDelete.length} files`);
}
