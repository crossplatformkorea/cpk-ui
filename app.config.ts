export default {
  expo: {
    plugins: [
      [
        'expo-font',
        {
          fonts: [
            './src/components/uis/Icon/cpk.ttf',
            './src/components/uis/Icon/Pretendard-Bold.otf',
            './src/components/uis/Icon/Pretendard-Regular.otf',
            './src/components/uis/Icon/Pretendard-Thin.otf',
          ],
        },
      ],
    ],
    experiments: {
      baseUrl: '/cpk-ui',
    },
    name: 'cpk-ui',
    slug: 'cpk-ui',
    privacy: 'public',
    platforms: ['ios', 'android', 'web'],
    orientation: 'default',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    splash: {
      resizeMode: 'contain',
      image: './assets/splash.png',
      backgroundColor: '#ffffff',
    },
    web: {
      favicon: './assets/icon.png',
      bundler: 'metro',
    },
  },
};
