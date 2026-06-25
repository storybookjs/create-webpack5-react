# Maintenance

This package (`create-webpack5-react`) is a small CLI that scaffolds a minimal
Webpack 5 + React + TypeScript project. It exists so we can test Storybook's
initializer against a non-CRA, custom project.

There is no build step for the package itself — `bin/index.js` is plain Node and
is published as-is. The only `node_modules` involved belong to the projects the
CLI *generates*, not to this repo.

## Testing

The CLI is validated end-to-end: generate a project, install its dependencies,
and build it. If all three steps pass, the generator works.

### Locally

From the repo root:

```bash
# Generate a project into ./temp
./bin/index.js ./temp

# Install and build the generated project
cd ./temp && pnpm install && pnpm run build
```

You can pass dependency versions through to the generated project, e.g.:

```bash
./bin/index.js ./temp --version-react="18" --version-webpack="^5.0.0"
```

Run `./bin/index.js --help` for the full usage. Delete `./temp` between runs
(`rm -rf ./temp`) so you start from a clean slate.

### In CI

`.github/workflows/test.yml` runs the exact same flow on every push and pull
request, across a Node version matrix (20, 22, 24) to cover the minimum
supported version declared in `engines.node` (`>=20`). If you bump that minimum,
update the matrix to match.

## Releasing

Releases are **completely manual** — there is intentionally no automated
publish workflow. (The old `auto shipit` release-on-push setup was removed.)

To cut a release:

1. Make sure you're on an up-to-date `main` with a clean working tree, and that
   CI is green.

2. Confirm what will be published. Only the paths in the `files` allowlist in
   `package.json` (`bin`, `template`, `README.md`, `LICENSE`) ship to npm:

   ```bash
   npm pack --dry-run
   ```

3. Bump the version. This updates `package.json` and creates a git tag:

   ```bash
   npm version patch   # or: minor | major
   ```

4. Update `CHANGELOG.md` with a short entry for the new version (see existing
   entries for the format).

5. Publish to npm. The package is public, so:

   ```bash
   npm publish --access public
   ```

   You need to be authenticated (`npm login`) and a member of the npm org/owner
   list for `create-webpack5-react`.

6. Push the commit and the tag:

   ```bash
   git push && git push --tags
   ```

If a publish fails partway through, fix the issue and publish again with a new
patch version rather than reusing a version number — npm does not allow
re-publishing an existing version.
