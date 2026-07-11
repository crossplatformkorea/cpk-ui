import 'react-native-gesture-handler/jestSetup';

process.env.EXPO_OS = 'ios';

global.__reanimatedWorkletInit = jest.fn();
