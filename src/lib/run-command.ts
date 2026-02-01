import { execSync } from "child_process";

export function runCommand(cmd: string) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (err) {
    return "";
  }
}
