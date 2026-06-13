# Publishing

Maintainer notes for publishing Sprout design tokens to npm.

The public npm package is currently `@insidiouss/sprout`. The unscoped `sprout` name is already taken on npm. The package can move to `@nourabuild/sprout` later after the `nourabuild` npm organization exists and the publishing account has access to that scope.

## Requirements

- The logged-in npm account owns the package scope.
- The logged-in npm account has two-factor authentication enabled for publishing, or it uses a granular npm access token with publish permission and 2FA bypass enabled.
- `npm pack --dry-run` shows the scoped package name, not `sprout`.
- Every npm publish must use a new version number. npm never allows overwriting a version that was already published.

If publishing fails with this error, the version already exists on npm:

```text
You cannot publish over the previously published versions
```

Fix it by bumping the version before publishing again:

```bash
npm version patch --no-git-tag-version
npm publish --access public
```

## Release Steps

1. Log in and confirm the npm account.

```bash
npm login
npm whoami
npm profile get
```

2. Bump the package version.

```bash
npm version patch --no-git-tag-version
```

Skip this only when publishing a package version that has never been uploaded before. To check the latest published version:

```bash
npm dist-tag ls @insidiouss/sprout
```

3. Build and validate the package.

```bash
npm run build
npm run lint
npm pack --dry-run
```

4. Publish the package.

```bash
npm publish --access public
```

5. Confirm the upload.

```bash
npm view @insidiouss/sprout version
npm view @insidiouss/sprout dist.tarball
```
