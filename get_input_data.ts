import { parse } from "https://deno.land/std/flags/mod.ts";

const { dir, rawDir, dryRun = false } = parse(Deno.args);

export function getInputData() {
  const jpgDirUrl = dir || "./";
  const rawDirUrl = rawDir || jpgDirUrl;

  return {
    jpgDirUrl,
    rawDirUrl,
    dryRun,
  };
}
