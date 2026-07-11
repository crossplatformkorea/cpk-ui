## Contribution Guide

> [ui.crossplatformkorea.com](https://ui.crossplatformkorea.com)

> To contribute to this repository, you should have a basic understanding of the following technologies (expertise is not required):

1. [React Native](https://reactnative.dev)
2. [Expo](https://expo.io)
3. [vscode](https://code.visualstudio.com)
   - We use `vscode` as our IDE. Please install the `eslint` plugin.
4. [kstyled](https://crossplatformkorea.github.io/kstyled)

### Things to Keep in Mind

> Components exported from `src` are compiled into the `lib` npm package.
> Every public component needs regression tests and colocated Storybook stories.
> Run the component and story coverage checks before opening a pull request.

## How to Contribute

### Installation

1. Fork this project.

   - It is recommended to keep the `main` branch of your fork updated with the upstream repository.
   - Configure [Syncing a Fork](https://help.github.com/articles/configuring-a-remote-for-a-fork/):
     - `git remote add upstream https://github.com/crossplatformkorea/cpk-ui`
     - Verify with `git remote -v`
   - Fetch branches from the upstream repository: `git fetch upstream`
   - Create a new branch before submitting a PR: `git checkout -b [feature_name]`
     - Before pushing the PR, fetch updates from the `main` branch: `git fetch upstream` and rebase: `git rebase main`
     - Check your status with: `git log --decorate --oneline --all --graph`

2. Clone your forked repository:
   ```
   git clone https://github.com/<your-github-username>/cpk-ui.git
   ```
3. Install dependencies:
   ```bash
   bun install --frozen-lockfile
   ```

4. Run the project:

   1. **Start Metro Bundler**
      ```bash
      bun run start
      ```

   2. **Run on iOS / Android / Web**
      ```bash
      bun run ios
      bun run android
      bun run web
      ```

      > If you encounter the error `We ran "xcodebuild" command but it exited with error code 65` on your first run, follow [this guide](https://github.com/facebook/react-native/issues/24450#issuecomment-516760157) to install [CocoaPods](https://cocoapods.org).

5. Configure linting correctly in [vscode](https://code.visualstudio.com):

   - Example vscode [setting.json](https://gist.github.com/hyochan/815e9040593180c4725d7694d863e5a1)

6. Run `bun run test:all` before pushing. Use `bun run storybook:web` for
   interactive component review and `bun run build` to verify package output.

---

### Commit Messages

Use Angular Conventional Commits: `<type>(<scope>): <subject>`.

- Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, or `chore`.
- Write an imperative, lowercase subject without a trailing period.
- Add a body when the reason or migration impact is not clear from the diff.

Example: `fix(button): preserve native press state`

---

### Coding Guidelines

Follow [hyochan/style-guide](https://github.com/hyochan/style-guide).

1. **Do not expose individual style attributes as props**.

   **Recommended**:
   ```tsx
   <Button textStyle={textStyle} />
   ```

   **Not Recommended**:
   ```tsx
   <Button textColor={textColor} />
   ```

   Exposing single style attributes leads to cluttered and unmaintainable components.

2. **Expose all style props in a `styles` object and use `style` for the parent component’s style**:
   ```tsx
   type Styles = {
     container?: StyleProp<ViewStyle>;
     text?: StyleProp<TextStyle>;
     disabledButton?: StyleProp<ViewStyle>;
     disabledText?: StyleProp<TextStyle>;
     hovered?: StyleProp<ViewStyle>;
   };
   ```

3. **Provide `React elements` for greater flexibility in components**:
   ```tsx
   <Checkbox
     startElement={<StyledText>Checkbox Example</StyledText>}
   />
   ```

4. **Keep components compact and expose extensibility with `render` functions**:
   ```tsx
   renderTitle={(item) => <Title>{item}</Title>}
   ```

5. **Provide default colors for each theme (`light` and `dark`)**:
   ```tsx
   color: ${({theme}) => theme.textContrast};
   ```

---

### Naming Conventions

- **testID**: Use `kebab-case` (e.g., `testID="my-test-id"`)
- **Class names**: Use `PascalCase`
- **Enums**: Use `PascalCase`
- **Constants**: Use `UPPER_SNAKE_CASE`
- **Variables and functions**: Use `camelCase`
- **Asset file names**: Use `lower_snake_case`

**Do not modify unrelated code to match these conventions.**

By following these conventions, we ensure a consistent and maintainable codebase.
