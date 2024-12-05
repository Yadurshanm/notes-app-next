export const VERSION = {
  major: 1,
  minor: 2,
  patch: 0,
  toString: () => `v${VERSION.major}.${VERSION.minor}.${VERSION.patch}`,
  getChangeDescription: () => ({
    '1.2.0': 'Added editor formatting features and organized toolbar',
    '1.1.0': 'Added categories and tags support',
    '1.0.0': 'Initial release with basic note-taking features',
  }),
  getLatestChanges: () => VERSION.getChangeDescription()[VERSION.toString()]
}