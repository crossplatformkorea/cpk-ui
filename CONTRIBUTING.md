## Contribution Guide

> [ui.crossplatformkorea.com](https://ui.crossplatformkorea.com)

> To contribute to this repository, you should have a basic understanding of the following technologies (expertise is not required):

1. [React Native](https://reactnative.dev)
2. [Expo](https://expo.io)
3. [vscode](https://code.visualstudio.com)
   - We use `vscode` as our IDE. Please install the `eslint` plugin.
4. [emotion](https://emotion.sh/docs/introduction)

### Things to Keep in Mind

> Only components in the `main` directory are published to `npm`. These are the components intended for production use.
> When creating new components, please ensure you write `test code` for them.
> Add stories to the same directory (e.g., component.stories.tsx) to showcase components. This allows users to easily view a demo of all components at a glance.

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
   ```
   yarn
   ```

4. Run the project:

   1. **Start Metro Bundler**
      ```
      yarn start
      ```

   2. **Run on iOS / Android / Web**
      Use [Expo Dev Tools](https://docs.expo.dev/workflow/development-mode/#toggling-development-mode-in-expo-dev-tools) to run on all three platforms.

      > If you encounter the error `We ran "xcodebuild" command but it exited with error code 65` on your first run, follow [this guide](https://github.com/facebook/react-native/issues/24450#issuecomment-516760157) to install [CocoaPods](https://cocoapods.org).

5. Configure linting correctly in [vscode](https://code.visualstudio.com):

   - Example vscode [setting.json](https://gist.github.com/hyochan/815e9040593180c4725d7694d863e5a1)

6. While implementing components, run `yarn watch` to dynamically build TypeScript files.

---

### Commit Messages

A commit message should include a title, summary, and a test plan.

- **Title**: Write in the imperative mood and add a tag ([android], [video], etc.) to indicate the affected code.
- **Summary**: Explain why the commit is needed and how it addresses the issue. Include details not apparent from the code itself.
- **Test Plan**: Describe how to verify that the changes work. This helps others write test plans for related areas in the future.

Refer to [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) for more guidance.

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
