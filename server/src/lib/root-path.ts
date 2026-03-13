import path from 'path';

const SRC_ROOT = path.resolve(__dirname, '..');

export default function fromSrcRoot(...segments: string[]) {
  return path.join(SRC_ROOT, ...segments);
}
