export default {
  expo: {
    plugins: [['expo-font', {fonts: ['main/uis/Icon/*']}]],
    experiments: {
      baseUrl: '/CPK-UI',
    },
    name: 'CPK-UI',
    slug: 'CPK-UI',
    privacy: 'public',
    platforms: ['ios', 'android', 'web'],
    orientation: 'default',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    splash: {
      resizeMode: 'cover',
      image: './assets/splash.png',
      backgroundColor: '#ffffff',
    },
    web: {
      favicon: './assets/icon.png',
      bundler: 'metro',
    },
  },
};
