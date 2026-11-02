import React, {useCallback, useMemo, useRef, type ReactElement} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {FlashList, type FlashListRef} from '@shopify/flash-list';
import {
  DraxHandle,
  DraxProvider,
  SortableContainer,
  SortableItem,
  useSortableList,
} from 'react-native-drax';
import {useTheme} from '../../../providers/ThemeProvider';
import {Icon} from '../Icon/Icon';

export interface ReorderableListItem<T> {
  item: T;
  index: number;
  /** Place this handle inside the row; other row actions remain independent. */
  dragHandle: ReactElement | null;
}

export interface ReorderableListProps<T> {
  data: T[];
  /** Use a stable item identity; index-only keys cannot survive reordering. */
  keyExtractor: (item: T, index: number) => string;
  getItemLabel: (item: T) => string;
  renderItem: (info: ReorderableListItem<T>) => ReactElement;
  /** Controlled order: update data immediately, then persist/rollback upstream. */
  onReorder: (data: T[]) => void;
  disabled?: boolean;
  extraData?: unknown;
  accessibilityHint?: string;
  testID?: string;
  styles?: {
    container?: StyleProp<ViewStyle>;
    content?: ViewStyle;
    item?: StyleProp<ViewStyle>;
    handle?: StyleProp<ViewStyle>;
  };
  renderHandle?: (info: {item: T; index: number}) => ReactElement;
  onDragStateChange?: (dragging: boolean) => void;
  onEndReached?: () => void;
  ListEmptyComponent?: ReactElement;
}

/** Virtualized, handle-only reordering. Requires the host's GestureHandlerRootView. */
export function ReorderableList<T>(
  props: ReorderableListProps<T>,
): ReactElement {
  return (
    <View style={[layout.container, props.styles?.container]}>
      <DraxProvider>
        <ReorderableContent {...props} />
      </DraxProvider>
    </View>
  );
}

function ReorderableContent<T>({
  data,
  keyExtractor,
  getItemLabel,
  renderItem,
  onReorder,
  disabled = false,
  extraData,
  accessibilityHint = 'Hold and drag to reorder. Adjust up or down to move one place.',
  testID = 'reorderable-list',
  styles,
  renderHandle,
  onDragStateChange,
  onEndReached,
  ListEmptyComponent,
}: ReorderableListProps<T>): ReactElement {
  const {theme} = useTheme();
  const scrollRef = useRef<FlashListRef<T>>(null);
  const acceptedPositions = useMemo(
    () =>
      new Map(
        data.map((item, index) => [keyExtractor(item, index), index + 1]),
      ),
    [data, keyExtractor],
  );
  const sortable = useSortableList({
    data,
    keyExtractor,
    onReorder: (event) => {
      if (!disabled && event.fromIndex !== event.toIndex) onReorder(event.data);
    },
    lockToMainAxis: true,
    // Mouse dragging should begin immediately; touch keeps scroll protection.
    longPressDelay: Platform.OS === 'web' ? 0 : 220,
    animationConfig: 'spring',
    inactiveItemStyle: {opacity: 0.8},
    onDragStart: () => onDragStateChange?.(true),
    onDragEnd: () => onDragStateChange?.(false),
  });
  const moveAccessible = useCallback(
    (item: T, rowIndex: number, direction: -1 | 1): void => {
      if (disabled) return;
      const key = keyExtractor(item, rowIndex);
      const from = data.findIndex(
        (row, index) => keyExtractor(row, index) === key,
      );
      const to = from + direction;
      if (from < 0 || to < 0 || to >= data.length) return;
      const next = [...data];
      next.splice(from, 1);
      next.splice(to, 0, item);
      onReorder(next);
    },
    [data, disabled, keyExtractor, onReorder],
  );
  return (
    <SortableContainer
      sortable={sortable}
      scrollRef={scrollRef}
      style={layout.container}
    >
      <FlashList
        ref={scrollRef}
        data={sortable.data}
        extraData={extraData}
        // A committed reorder must not scroll to keep the former first item
        // anchored. The gesture engine already owns motion and autoscroll.
        maintainVisibleContentPosition={{disabled: true}}
        // Stable domain keys also keep recycled editors attached to their item.
        keyExtractor={keyExtractor}
        contentContainerStyle={styles?.content}
        onScroll={sortable.onScroll}
        onContentSizeChange={sortable.onContentSizeChange}
        onEndReached={onEndReached}
        ListEmptyComponent={ListEmptyComponent}
        scrollEventThrottle={16}
        testID={testID}
        renderItem={({item, index}) => (
          <SortableItem
            sortable={sortable}
            index={index}
            draggable={!disabled}
            dragHandle
            style={styles?.item}
            accessible={false}
            accessibilityRole="none"
            accessibilityLabel={undefined}
            accessibilityHint={undefined}
          >
            {renderItem({
              item,
              index,
              dragHandle: disabled ? null : (
                <DraxHandle>
                  <View
                    accessible
                    focusable
                    {...(Platform.OS === 'web'
                      ? {
                          tabIndex: 0 as const,
                          onKeyDown: (event: {
                            key: string;
                            preventDefault: () => void;
                          }) => {
                            if (
                              event.key !== 'ArrowUp' &&
                              event.key !== 'ArrowDown'
                            )
                              return;
                            event.preventDefault();
                            moveAccessible(
                              item,
                              index,
                              event.key === 'ArrowUp' ? -1 : 1,
                            );
                          },
                        }
                      : {})}
                    accessibilityRole="adjustable"
                    accessibilityLabel={getItemLabel(item)}
                    accessibilityHint={accessibilityHint}
                    accessibilityValue={{
                      min: 1,
                      max: data.length,
                      now:
                        acceptedPositions.get(keyExtractor(item, index)) ??
                        index + 1,
                    }}
                    accessibilityActions={[
                      {name: 'increment'},
                      {name: 'decrement'},
                    ]}
                    onAccessibilityAction={({nativeEvent}) => {
                      if (nativeEvent.actionName === 'increment')
                        moveAccessible(item, index, 1);
                      if (nativeEvent.actionName === 'decrement')
                        moveAccessible(item, index, -1);
                    }}
                    testID={`${testID}-handle-${keyExtractor(item, index)}`}
                    style={[layout.handle, styles?.handle]}
                  >
                    {renderHandle?.({item, index}) ?? (
                      <Icon
                        name="DotsSixVertical"
                        size={22}
                        color={theme.text.label}
                      />
                    )}
                  </View>
                </DraxHandle>
              ),
            })}
          </SortableItem>
        )}
      />
    </SortableContainer>
  );
}

const layout = StyleSheet.create({
  container: {flex: 1, minHeight: 0},
  handle: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
