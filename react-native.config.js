const android = require('@react-native-community/cli-platform-android');
const ios = require('@react-native-community/cli-platform-ios');
const {
  bundleCommand,
  startCommand,
} = require('@react-native/community-cli-plugin');

module.exports = {
  commands: [
    bundleCommand,
    startCommand,
    ...android.commands,
    ...ios.commands,
  ],

  platforms: {
    android: {
      projectConfig: android.projectConfig,
      dependencyConfig: android.dependencyConfig,
    },
    ios: {
      projectConfig: ios.projectConfig,
      dependencyConfig: ios.dependencyConfig,
    },
  },

  project: {
    android: {
      sourceDir: './android',
      manifestPath: './android/app/src/main/AndroidManifest.xml',
      packageName: 'com.nestboard',
    },
    ios: {
      sourceDir: './ios',
    },
  },

  assets: [],
};