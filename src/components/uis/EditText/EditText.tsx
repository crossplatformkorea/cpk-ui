import type {MutableRefObject, ReactNode, RefObject} from 'react';
import React, {
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useHover} from 'react-native-web-hooks';
import {css} from 'kstyled';

import {Icon} from '../Icon/Icon';
import {cloneElemWithDefaultColors} from '../../../utils/guards';
import {useTheme} from '../../../providers/ThemeProvider';
import {Typography} from '../Typography/Typography';
import {isWeb, safePlatformSelect} from '../../../utils/platform';

export type EditTextStyles = {
  container?: StyleProp<ViewStyle>;
  labelContainer?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  inputContainer?: StyleProp<TextStyle>;
  input?: StyleProp<TextStyle>;
  error?: StyleProp<TextStyle>;
  counter?: StyleProp<TextStyle>;
};

export type EditTextStatus =
  | 'disabled'
  | 'error'
  | 'focused'
  | 'hovered'
  | 'basic';

type RenderType = (stats: EditTextStatus) => React.JSX.Element;

type CustomRenderType =
  | (({color, status}: {color: string; status: EditTextStatus}) => React.JSX.Element)
  | null;

export type EditTextProps = {
  testID?: TextInputProps['testID'];
  inputRef?: MutableRefObject<TextInput | undefined> | RefObject<TextInput>;
  style?: StyleProp<ViewStyle>;
  styles?: EditTextStyles;

  // Component
  startElement?: React.JSX.Element | CustomRenderType;
  endElement?: React.JSX.Element | CustomRenderType;
  required?: boolean;
  label?: string | RenderType;
  error?: string | RenderType;
  direction?: 'row' | 'column';
  decoration?: 'underline' | 'boxed';
  value?: TextInputProps['value'];
  multiline?: TextInputProps['multiline'];
  onChange?: TextInputProps['onChange'];
  onChangeText?: TextInputProps['onChangeText'];
  placeholder?: TextInputProps['placeholder'];
  placeholderColor?: TextInputProps['placeholderTextColor'];
  onFocus?: TextInputProps['onFocus'] | undefined;
  onBlur?: TextInputProps['onBlur'] | undefined;
  editable?: TextInputProps['editable'];
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: TextInputProps['secureTextEntry'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  numberOfLines?: TextInputProps['numberOfLines'];
  maxLength?: TextInputProps['maxLength'];
  hideCounter?: boolean;

  textInputProps?: Omit<
    TextInputProps,
    | 'value'
    | 'onChange'
    | 'numberOfLines'
    | 'multiline'
    | 'onChange'
    | 'onChangeText'
    | 'placeholder'
    | 'placeholderTextColor'
    | 'onFocus'
    | 'onBlur'
    | 'editable'
    | 'autoComplete'
    | 'autoCapitalize'
    | 'secureTextEntry'
    | 'onSubmitEditing'
    | 'maxLength'
  >;

  colors?: {
    basic?: string;
    disabled?: string;
    error?: string;
    focused?: string;
    hovered?: string;
    placeholder?: string;
  };
};

export const EditText = forwardRef<TextInput, EditTextProps>(
  (
    {
      testID,
      textInputProps,
      style,
      styles,
      label,
      error,
      startElement,
      endElement,
      multiline = false,
      value = '',
      placeholder,
      placeholderColor,
      onChange,
      onChangeText,
      onFocus,
      onBlur,
      onSubmitEditing,
      numberOfLines,
      maxLength,
      hideCounter = false,
      autoComplete,
      autoCapitalize = 'none',
      secureTextEntry = false,
      editable = true,
      direction = 'column',
      decoration = 'underline',
      colors = {},
      required = false,
    }: EditTextProps,
    ref,
  ): React.JSX.Element => {
    EditText.displayName = 'EditText';

    const {theme} = useTheme();
    const webRef = useRef<View>(null);
    const [focused, setFocused] = useState(false);
    const defaultInputRef = useRef(null);
    const inputRef = (ref as MutableRefObject<TextInput>) || defaultInputRef;
    const hovered = useHover(webRef);

    // Memoize default container style
    const defaultContainerStyle = useMemo(() => css`
      flex-direction: ${direction};
    `, [direction]);

    // Memoize default color calculation
    const defaultColor = useMemo(() => {
      if (!editable) return colors.disabled || theme.text.disabled;
      if (error) return colors.error || theme.text.validation;
      if (focused) return colors.focused || theme.text.basic;
      if (hovered) return colors.hovered || theme.text.basic;
      return colors.placeholder || theme.text.placeholder;
    }, [
      editable,
      error,
      focused,
      hovered,
      colors.disabled,
      colors.error,
      colors.focused,
      colors.hovered,
      colors.placeholder,
      theme.text.disabled,
      theme.text.validation,
      theme.text.basic,
      theme.text.placeholder,
    ]);

    // Memoize label placeholder color
    const labelPlaceholderColor = useMemo(
      () =>
        defaultColor === (colors.placeholder || theme.text.placeholder) && {
          color: colors.placeholder || theme.text.disabled,
        },
      [
        colors.placeholder,
        defaultColor,
        theme.text.disabled,
        theme.text.placeholder,
      ],
    );

    // Memoize status calculation
    const status: EditTextStatus = useMemo(() => {
      if (!editable) return 'disabled';
      if (error) return 'error';
      if (hovered) return 'hovered';
      if (focused) return 'focused';
      return 'basic';
    }, [editable, error, hovered, focused]);

    // Memoize render label function
    const renderLabel = useCallback((): React.JSX.Element | null => {
      // eslint-disable-next-line react/no-unstable-nested-components
      function Wrapper({children}: {children: ReactNode}): React.JSX.Element {
        return (
          <View
            style={[
              css`
                margin-bottom: ${decoration === 'boxed' ? '14px' : 0};

                flex-direction: row;
                align-items: center;
              `,
              styles?.labelContainer,
            ]}
          >
            {children}
            {required ? (
              <Icon
                name="AsteriskBold"
                style={css`
                  color: ${theme.role.danger};
                  opacity: ${focused ? '1' : '0.5'};
                `}
              />
            ) : null}
          </View>
        );
      }

      return typeof label === 'string' ? (
        <Wrapper>
          <Typography.Heading5
            style={[
              css`
                color: ${defaultColor};
                margin-right: 4px;
                font-size: 16px;
              `,
              labelPlaceholderColor,
              styles?.label,
            ]}
          >
            {label}
          </Typography.Heading5>
        </Wrapper>
      ) : label ? (
        <Wrapper>{label(status)}</Wrapper>
      ) : null;
    }, [
      decoration,
      defaultColor,
      focused,
      label,
      labelPlaceholderColor,
      required,
      status,
      styles?.label,
      styles?.labelContainer,
      theme.role.danger,
    ]);

    // Memoize render container function
    const renderContainer = useCallback(
      (children: ReactNode): React.JSX.Element => {
        return (
          <TouchableWithoutFeedback
            onPress={() => inputRef.current?.focus()}
            testID="container-touch"
          >
            <View
              style={[
                defaultContainerStyle,
                css`
                  flex-direction: ${direction};
                  align-items: ${direction === 'row' ? 'center' : 'flex-start'};
                  justify-content: ${direction === 'row'
                    ? 'flex-start'
                    : 'space-between'};
                  border-color: ${labelPlaceholderColor
                    ? labelPlaceholderColor.color
                    : defaultColor};
                `,
                decoration === 'boxed'
                  ? css`
                      border-radius: 4px;
                      border-width: 1px;
                      padding-left: 12px;
                      padding-right: 12px;
                    `
                  : css`
                      border-bottom-width: 1px;
                    `,
                styles?.container,
              ]}
              testID="container"
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        );
      },
      [
        decoration,
        defaultColor,
        defaultContainerStyle,
        direction,
        inputRef,
        labelPlaceholderColor,
        styles?.container,
      ],
    );

    // Memoize render input function
    const renderInput = useCallback((): React.JSX.Element | null => {
      return (
        <View
          style={[
            direction === 'row'
              ? css`
                  flex: 1;
                `
              : css`
                  align-self: stretch;
                `,
            css`
              padding: ${decoration === 'boxed' ? '4px 0' : '2px 0'};

              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            `,
            styles?.inputContainer,
          ]}
        >
          <>
            {isValidElement(startElement)
              ? cloneElemWithDefaultColors({
                  element: startElement,
                  color: defaultColor,
                  style: css`
                    margin-left: -4px;
                    margin-right: 4px;
                  `,
                })
              : startElement}
            <TextInput
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              editable={editable}
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={numberOfLines}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              onChange={onChange}
              onChangeText={onChangeText}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onSubmitEditing={onSubmitEditing}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor || theme.text.placeholder}
              ref={inputRef}
              secureTextEntry={secureTextEntry}
              selectionColor={theme.role.underlay}
              style={[
                // Stretch input in order to make remaining space clickable
                css`
                  font-family: Pretendard;
                  flex: 1;
                  font-size: 16px;
                  text-align-vertical: ${multiline ? 'top' : 'center'};
                `,
                isWeb() &&
                  css`
                    outline-width: 0;
                  `,
                direction === 'column'
                  ? css`
                      padding-top: 12px;
                    `
                  : css`
                      padding-left: 12px;
                    `,
                css`
                  color: ${defaultColor};
                  padding: 10px 0 12px 0;
                `,
                styles?.input,
              ]}
              testID={testID}
              value={value}
              {...textInputProps}
            />
            {isValidElement(endElement)
              ? cloneElemWithDefaultColors({
                  element: endElement,
                  color: defaultColor,
                  style: css`
                    margin-left: 4px;
                    margin-right: ${decoration === 'boxed' ? '-8px' : '-4px'};
                  `,
                })
              : endElement}
          </>
        </View>
      );
    }, [
      autoCapitalize,
      autoComplete,
      decoration,
      defaultColor,
      direction,
      editable,
      endElement,
      inputRef,
      maxLength,
      multiline,
      numberOfLines,
      onBlur,
      onChange,
      onChangeText,
      onFocus,
      onSubmitEditing,
      placeholder,
      placeholderColor,
      secureTextEntry,
      startElement,
      styles?.input,
      styles?.inputContainer,
      testID,
      textInputProps,
      theme.role.underlay,
      theme.text.placeholder,
      value,
    ]);

    // Memoize render error function
    const renderError = useCallback((): React.JSX.Element | null => {
      return error ? (
        typeof error === 'string' ? (
          <Text
            style={[
              css`
                flex: 1;
                color: ${theme.text.validation};
                font-size: 12px;
              `,
              styles?.error,
            ]}
          >
            {error}
          </Text>
        ) : (
          error?.(status)
        )
      ) : null;
    }, [error, status, styles?.error, theme.text.validation]);

    // Memoize render counter function
    const renderCounter = useCallback((): React.JSX.Element | null => {
      if (hideCounter) {
        return null;
      }

      return maxLength ? (
        <Text
          style={[
            css`
              color: ${theme.text.placeholder};
              font-size: 12px;
            `,
            styles?.counter,
          ]}
        >{`${value.length}/${maxLength}`}</Text>
      ) : null;
    }, [
      hideCounter,
      maxLength,
      styles?.counter,
      theme.text.placeholder,
      value.length,
    ]);

    return (
      <View
        ref={safePlatformSelect({web: webRef, default: undefined})}
        style={[
          css`
            width: 100%;
          `,
          style,
        ]}
        testID="edit-text"
      >
        {renderLabel()}
        {renderContainer(renderInput())}
        {renderError() || renderCounter() ? (
          <View
            style={css`
              margin-top: 6px;

              flex-direction: ${!renderError() && renderCounter()
                ? 'row-reverse'
                : 'row'};
              gap: 4px;
            `}
          >
            {renderError()}
            {renderCounter()}
          </View>
        ) : null}
      </View>
    );
  },
);

// Export memoized EditText component for better performance
export default React.memo(EditText) as typeof EditText;
