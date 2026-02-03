import { execSync } from 'child_process';

export function runCommand(cmd: string) {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim();
}
