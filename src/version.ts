export const VERSION = {
  major: 1,
  minor: 3,
  patch: 0,
  toString: () => `v${VERSION.major}.${VERSION.minor}.${VERSION.patch}`,
  getChangeDescription: () => ({
    '1.3.0': 'Refactored project and improved editor features',
    '1.2.0': 'Added editor formatting features',
    '1.1.0': 'Added categories support',
    '1.0.0': 'Initial release',
  }),
  getLatestChanges: () => VERSION.getChangeDescription()[VERSION.toString()]
}