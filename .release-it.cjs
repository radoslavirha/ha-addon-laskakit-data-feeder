module.exports = {
  git: {
    requireBranch: 'main',
    commit: true,
    commitMessage: 'chore: :bookmark: Release ${version}',
    push: true,
    requireCleanWorkingDir: false,
    tag: true,
    tagAnnotation: 'Release ${version}',
    tagName: '${version}'
  },
  npm: false,
  hooks: {
    'before:init': ['git pull', 'git fetch --tags origin' ]
  },
  github: {
    release: true
  },
  plugins: {
    '@release-it/conventional-changelog': {
      header: '# Changelog',
      infile: 'CHANGELOG.md',
      preset: {
        name: 'conventionalcommits',
        types: [
          { type: 'feat', section: 'Features', hidden: false },
          { type: 'fix', section: 'Bug Fixes', hidden: false },
          { type: 'build', section: 'Build', hidden: false },
          { type: 'refactor', section: 'Refactor', hidden: false },
          { type: 'test', section: 'Tests', hidden: false },
          { type: 'docs', section: 'Documentation', hidden: false },
          {}
        ],
        issuePrefixes:['#']
      }
    },
    '@release-it-plugins/workspaces': {
      skipChecks: true,
      publish: false,
      additionalManifests: {
        versionUpdates: [ 'package.json']
      }
    },
  }
};