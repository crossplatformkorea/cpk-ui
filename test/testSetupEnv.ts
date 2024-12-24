import "@testing-library/jest-native/extend-expect";
import "jest-plugin-context/setup";
import "givens/setup";

import { createSerializer } from "@emotion/jest";
import { matchers } from "@emotion/jest";

// Emotion snapshot serializer 추가
expect.addSnapshotSerializer(createSerializer());

// Emotion custom matchers 추가
expect.extend(matchers);

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

jest.mock("expo-font", () => {
  return {
    loadAsync: jest.fn().mockResolvedValue(true),
    isLoaded: jest.fn().mockReturnValue(true),
    useFonts: () => [],
  };
});

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line jest/no-jasmine-globals
  fail(err);
});

beforeAll(() => {
  // we're using fake timers because we don't want to
  // wait a full second for this test to run.
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
