import type {MutableRefObject, ReactNode, RefObject} from 'react';
import React, {
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactElement,
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

export type EditTextSizeType = 'small' | 'medium' | 'large' | number;

export type EditTextStatus =
  | 'disabled'
  | 'error'
  | 'focused'
  | 'hovered'
  | 'basic';

type RenderType = (stats: EditTextStatus) => ReactElement;

type CustomRenderType =
  | (({color, status}: {color: string; status: EditTextStatus}) => ReactElement)
  | null;

export type EditTextProps = {
  testID?: TextInputProps['testID'];
  inputRef?: MutableRefObject<TextInput | undefined> | RefObject<TextInput>;
  style?: StyleProp<ViewStyle>;
  styles?: EditTextStyles;
  size?: EditTextSizeType;

  // Component
  startElement?: ReactElement | CustomRenderType;
  endElement?: ReactElement | CustomRenderType;
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
      size = 'medium',
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
  ): ReactElement => {
    EditText.displayName = 'EditText';

    const {theme} = useTheme();

    // Calculate sizes based on size prop
    const sizeConfig = useMemo(() => {
      if (typeof size === 'number') {
        return {
          fontSize: size,
          labelFontSize: size,
          iconSize: size * 0.875,
          padding: size * 0.625,
          labelMargin: size * 0.875,
          errorFontSize: size * 0.75,
          counterFontSize: size * 0.75,
        };
      }

      switch (size) {
        case 'small':
          return {
            fontSize: 14,
            labelFontSize: 14,
            iconSize: 12,
            padding: 8,
            labelMargin: 12,
            errorFontSize: 10,
            counterFontSize: 10,
          };
        case 'large':
          return {
            fontSize: 18,
            labelFontSize: 18,
            iconSize: 16,
            padding: 12,
            labelMargin: 16,
            errorFontSize: 14,
            counterFontSize: 14,
          };
        default: // 'medium'
          return {
            fontSize: 16,
            labelFontSize: 16,
            iconSize: 14,
            padding: 10,
            labelMargin: 14,
            errorFontSize: 12,
            counterFontSize: 12,
          };
      }
    }, [size]);
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
    const renderLabel = useCallback((): ReactElement | null => {
      // eslint-disable-next-line react/no-unstable-nested-components
      function Wrapper({children}: {children: ReactNode}): ReactElement {
        return (
          <View
            style={[
              css`
                margin-bottom: ${decoration === 'boxed' ? sizeConfig.labelMargin : 0}px;

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
                size={sizeConfig.iconSize}
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
                font-size: ${sizeConfig.labelFontSize}px;
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
      sizeConfig,
      status,
      styles?.label,
      styles?.labelContainer,
      theme.role.danger,
    ]);

    // Memoize render container function
    const renderContainer = useCallback(
      (children: ReactNode): ReactElement => {
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
                      padding-left: ${sizeConfig.padding}px;
                      padding-right: ${sizeConfig.padding}px;
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
        sizeConfig,
        styles?.container,
      ],
    );

    // Memoize render input function
    const renderInput = useCallback((): ReactElement | null => {
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
              padding: ${decoration === 'boxed' ? `${sizeConfig.padding * 0.4}px 0` : `${sizeConfig.padding * 0.2}px 0`};

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
                  font-size: ${sizeConfig.fontSize}px;
                  text-align-vertical: ${multiline ? 'top' : 'center'};
                `,
                isWeb() &&
                  css`
                    outline-width: 0;
                  `,
                direction === 'column'
                  ? css`
                      padding-top: ${sizeConfig.padding}px;
                    `
                  : css`
                      padding-left: ${sizeConfig.padding}px;
                    `,
                css`
                  color: ${defaultColor};
                  padding: ${sizeConfig.padding}px 0 ${sizeConfig.padding * 1.2}px 0;
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
      sizeConfig,
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
    const renderError = useCallback((): ReactElement | null => {
      return error ? (
        typeof error === 'string' ? (
          <Text
            style={[
              css`
                flex: 1;
                color: ${theme.text.validation};
                font-size: ${sizeConfig.errorFontSize}px;
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
    }, [error, sizeConfig, status, styles?.error, theme.text.validation]);

    // Memoize render counter function
    const renderCounter = useCallback((): ReactElement | null => {
      if (hideCounter) {
        return null;
      }

      return maxLength ? (
        <Text
          style={[
            css`
              color: ${theme.text.placeholder};
              font-size: ${sizeConfig.counterFontSize}px;
            `,
            styles?.counter,
          ]}
        >{`${value.length}/${maxLength}`}</Text>
      ) : null;
    }, [
      hideCounter,
      maxLength,
      sizeConfig,
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
