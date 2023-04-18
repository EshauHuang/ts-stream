import { access, constants, mkdir } from "node:fs/promises";

export default async function (directory) {
  try {
    await access(directory, constants.F_OK);
  } catch (error) {
    await mkdir(directory, { recursive: true });
  }
  console.log("Generate Finish");
}
