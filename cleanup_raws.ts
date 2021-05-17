import { getInputData } from "./get_input_data.ts";
import { deleteFiles, filterByExt, parseFileName } from "./helpers.ts";
const { dryRun, jpgDirUrl, rawDirUrl } = getInputData();

export async function cleanupRaws() {
  const jpgDir = Deno.readDirSync(jpgDirUrl);
  const rawDir = Deno.readDirSync(rawDirUrl);

  const rawExtensions = ["orf", "dng"];
  const jpgExtensions = ["jpg", "jpegs"];

  const jpgList = [...jpgDir].filter(filterByExt(jpgExtensions));
  const rawList = [...rawDir].filter(filterByExt(rawExtensions));
  const jpgNames = new Set(
    jpgList.map(({ name }) => parseFileName(name).baseName),
  );

  const rawToDelete = rawList.filter(({ name }) =>
    !jpgNames.has(parseFileName(name).baseName)
  );
  const filesToDelete = rawToDelete.map(({ name }) => `${rawDirUrl}/${name}`);

  if (dryRun) {
    console.log("filesToDelete", filesToDelete.length);
    console.log(JSON.stringify(filesToDelete, null, 2));
  } else {
    await Promise.all(deleteFiles(filesToDelete));
    console.log(`deleted ${filesToDelete.length} files`);
  }
}
