import { access, constants } from "node:fs/promises";

export default async function (directory: string) {
  try {
    await access(directory, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
