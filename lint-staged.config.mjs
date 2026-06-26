// ESLint 9 flat config is resolved from the working directory, not per-file,
// so in this monorepo each workspace's lint must run inside that workspace.
// lint-staged passes absolute paths, which ESLint accepts from any cwd; the
// `cd` only fixes which eslint.config the run discovers.
const eslintFix = dir => files =>
  `bash -c "cd ${dir} && eslint --fix ${files.map(f => `'${f}'`).join(' ')}"`

export default {
  'apps/backend/**/*.ts': eslintFix('apps/backend'),
  'apps/frontend/**/*.{ts,tsx}': eslintFix('apps/frontend'),
}
