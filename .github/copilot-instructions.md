# GitHub Copilot Custom Instructions for CPK

## 1️⃣ General Coding Guidelines

- Always use **TypeScript (TSX) and ES6+ syntax**.
- Follow the **CPK React Native coding style** as defined in `.vscode/cpk.code-snippets`.
- Use **explicit type definitions** for function parameters and return values.
- Always use **named exports** for utility functions.
- Prefer **functional components** over class components.
- Use `styled.View` instead of `View` for wrapping components.
- **Use `css` from `@emotion/native` for inline styles instead of passing props to `styled-components`**.
- Follow **consistent indentation, double quotes for strings, and no semicolons**.

## 2️⃣ React Native Component Guidelines

- All component files must use **PascalCase** (e.g., `MyComponent.tsx`).
- Component files should have a **CPK prefix** when applicable (e.g., `CPKButton.tsx`).
- Always use the `isTablet` property from `useCPK()` for responsive design:
  ```tsx
  const {theme, media: {isTablet}} = useCPK();
  
  return (
    <View 
      style={css`
        padding: ${isTablet ? '24px' : '16px'};
        max-width: ${isTablet ? '600px' : '100%'};
      `}
    />
  );
  ```
- Every component should include the following structure:

  ```tsx
  /**
   * @name MyComponent
   *
   * See the style guide: https://github.com/hyochan/style-guide/blob/main/docs/REACT.md
   */
  import styled, {css} from '@emotion/native';
  import {View} from 'react-native';

  type Props = {};

  export default function MyComponent({}: Props): JSX.Element {
    return (
      <Container>
        <View
          style={css`
            margin: 0 16px;
            padding: 16px 24px;
            border-bottom-width: 1px;
            border-bottom-color: #ddd;
            gap: 4px;
          `}
        >
          <Typography.Body1
            style={css`
              font-weight: bold;
            `}
          >
            Example Text
          </Typography.Body1>
        </View>
      </Container>
    );
  }

  const Container = styled.View`
    flex: 1;
  `;
  ```

- **Use `css` from `@emotion/native` for inline styles, rather than passing props to `styled-components`**.
- **Avoid passing props to `styled-components`, unless necessary**.
- **React hooks (`useState`, `useEffect`, etc.)** should be used instead of class-based components.

## 3️⃣ File & Directory Structure

CPK projects use `expo-router`, which determines the structure of the project as follows:

```
app/            # Page components managed by Expo Router (similar to Next.js pages)
src/            # Core logic and reusable code
  ├── apis/       # API request functions
  ├── hooks/      # Custom hooks
  ├── modals/     # Modal-related components
  ├── providers/  # Context API and global providers
  ├── stores/     # Zustand state management
  ├── uis/        # UI components (buttons, cards, etc.)
  ├── utils/      # Utility functions
assets/         # Static files (fonts, icons, translations, animations, etc.)
  ├── fonts/      # Custom font files
  ├── icons/      # SVG and image icons
  ├── langs/      # JSON files for internationalization
  ├── lotties/    # Lottie animation JSON files
```

### 📂 `app/` Folder

- Uses `expo-router` for page-based routing.
- Similar to the `pages/` folder in Next.js, where the file structure defines the URL paths.

### 📂 `src/` Folder

- Stores core logic and shared components across the app.
- While `app/` contains page components, `src/` holds **reusable logic and business functionalities**.

Each subfolder serves a specific purpose:

- **`apis/`**: API request functions (fetchers for `React Query`).
- **`hooks/`**: Custom hooks (`useAuth`, `useTheme`, `useIsMounted`, etc.).
- **`modals/`**: Modal-related components (`CPKAlertModal`, `CPKBottomSheet`, etc.).
- **`providers/`**: Global context providers (`ThemeProvider`, `AuthProvider`, etc.).
- **`stores/`**: Zustand state management stores (`useUserStore`, `useDDayStore`, etc.).
- **`uis/`**: UI components (`CPKButton`, `CPKCard`, `CPKTypography`, etc.).
- **`utils/`**: Utility functions (`formatDate`, `debounce`, `isValidEmail`, etc.).

### 📂 `assets/` Folder

- Contains **static assets** such as images, fonts, and translation files.
- Organized into the following subfolders:
  - **`fonts/`**: Custom font files (`.ttf`, `.otf`).
  - **`icons/`**: SVG and PNG icons.
  - **`langs/`**: JSON translation files for internationalization.
  - **`lotties/`**: Lottie animation JSON files.

## 4️⃣ API & Data Fetching Guidelines

- Use **React Query** for API calls whenever possible.
- Always use **`async/await`** for API requests instead of `.then()`.
- API functions should be placed in `services/` and follow this naming convention:
  - `getSomething`
  - `postSomething`
  - `updateSomething`
  - `deleteSomething`
- Use the following structure for API calls:

  ```tsx
  import {useQuery} from '@tanstack/react-query';
  import axios from 'axios';

  const fetchUser = async (userId: string) => {
    const {data} = await axios.get(`/api/users/${userId}`);
    return data;
  };

  export const useUser = (userId: string) => {
    return useQuery(['user', userId], () => fetchUser(userId));
  };
  ```

## 5️⃣ State Management Guidelines (Zustand)

- Use **Zustand** for global state management.
- Store files should follow the pattern: `useSomethingStore.ts`.
- Always use the `immer` middleware for state immutability.
- Use **shallow comparison** when selecting state to avoid unnecessary re-renders.
- Example:

  ```tsx
  import create from 'zustand';
  import {immer} from 'zustand/middleware/immer';

  type UserState = {
    name: string;
    setName: (name: string) => void;
  };

  export const useUserStore = create<UserState>()(
    immer((set) => ({
      name: '',
      setName: (name) =>
        set((state) => {
          state.name = name;
        }),
    })),
  );
  ```

## 6️⃣ Styling Guidelines (Emotion & Inline CSS)

- **Use `css` from `@emotion/native` for inline styles instead of passing props to `styled-components`**.
- **Avoid defining styles inside `styled-components` when dynamic styles are needed**.
- **Prefer inline styles for components used less than twice in a file**.
- **For responsive design, always use the `isTablet` property from `useCPK()`**:
  ```tsx
  const {theme, media: {isTablet}} = useCPK();
  ```
- **Example (Allowed - `css` in inline style)**:

  ```tsx
  import styled, {css} from '@emotion/native';

  export default function ExampleComponent() {
    return (
      <StyledView>
        <Text
          style={css`
            font-size: 16px;
            font-weight: bold;
            color: #333;
          `}
        >
          Inline CSS Example
        </Text>
      </StyledView>
    );
  }

  const StyledView = styled.View`
    padding: 16px;
  `;
  ```

- **Example (Not Allowed - Using props inside `styled-components`)**:

  ```tsx
  const Button = styled.TouchableOpacity<{isActive: boolean}>`
    background-color: ${(props) => (props.isActive ? 'blue' : 'gray')};
  `;
  ```

  **🚨 Instead, use inline `css` from `@emotion/native`**:

  ```tsx
  <TouchableOpacity
    style={css`
      background-color: ${isActive ? 'blue' : 'gray'};
    `}
  />
  ```

- **For conditional styles, group them together in a template literal**:

  ```tsx
  // ❌ Don't separate conditional styles
  <View
    style={css`
      background-color: ${selected ? blue : gray};
      border-color: ${selected ? darkBlue : gray};
    `}
  />

  // ✅ Group conditional styles together
  <View
    style={css`
      ${selected
        ? `
          background-color: ${blue};
          border-color: ${darkBlue};
        `
        : `
          background-color: ${gray};
          border-color: ${gray};
        `}
    `}
  />
  ```

- **Dynamic Values in CSS Strings**

  When using dynamic values with units in CSS strings, always use string concatenation to avoid an Emotion bug that occurs with template literals:

  ```tsx
  const height = 50;
  
  // ❌ Don't use this format - units will be stripped
  <View
    style={css`
      height: ${height}px;
    `}
  />;
  
  // ✅ Always use this format instead
  <View
    style={css`
      height: ${height + 'px'};
    `}
  />;
  ```

  **🚨 Important:** The `+ 'px'` syntax is required because Emotion has a bug that strips units when using template literals with units directly. Always write `height: ${height + 'px'};` instead of `height: ${height}px;` to prevent this issue.

- **Shadow and Elevation Styles**

  For shadow and elevation styles, use React Native inline styles instead of Emotion CSS to ensure proper platform compatibility:

  ```tsx
  // ❌ Don't use shadow styles in Emotion CSS
  const StyledView = styled.View`
    elevation: ${elevation};
    shadow-offset: {
      width: 0,
      height: ${elevation / 2}px,
    };
    shadow-opacity: 0.1;
    shadow-radius: ${elevation}px;
    shadow-color: ${theme.text.basic};
  `;

  // ✅ Use React Native inline styles instead
  const shadowStyle = useMemo(() => ({
    elevation: elevation,
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    shadowColor: theme.text.basic,
  }), [elevation, theme.text.basic]);

  <View style={[shadowStyle, otherStyles]} />
  ```

  **🚨 Important:** Shadow properties like `elevation`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, and `shadowColor` should always be applied as React Native inline styles for proper cross-platform rendering.

## 7️⃣ Git Commit Message Guidelines

- Use the following format for commit messages:
  - `feat: Add new feature`
  - `fix: Fix a bug`
  - `chore: Update dependencies`
  - `refactor: Improve code structure`
  - `docs: Update documentation`
  - `test: Add or update tests`
- Always write commit messages in **present tense**:
  - ✅ `Add new authentication method`
  - ❌ `Added new authentication method`

## 8️⃣ Linting & Formatting

- **ESLint & Prettier** must be used to enforce style rules.
- Use **double quotes for strings**, **tabs for indentation**, and **no semicolons**.
- Always run `yarn lint` before committing changes.

---

## 🎯 Summary

- Follow **CPK React Native coding style** (`.vscode/cpk.code-snippets`).
- Use **TypeScript & React Hooks**.
- Manage state with **Zustand**.
- Fetch data using **React Query**.
- **Use `css` from `@emotion/native` instead of passing props to `styled-components`**.
- Structure files properly in `src/components/uis`, `app/`, and `stores/`.
- Follow **consistent Git commit message rules**.

By following these guidelines, we ensure high-quality, maintainable code that aligns with our team's best practices. 🚀
