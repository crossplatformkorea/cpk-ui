import {useCallback, useState} from 'react';
import {Platform, type ViewProps} from 'react-native';

type HoverProps = Pick<ViewProps, 'onPointerEnter' | 'onPointerLeave'>;

export function useHoverState(): {
  hovered: boolean;
  hoverProps: HoverProps;
} {
  const [hovered, setHovered] = useState(false);
  const handlePointerEnter = useCallback(() => setHovered(true), []);
  const handlePointerLeave = useCallback(() => setHovered(false), []);

  return {
    hovered,
    hoverProps:
      Platform?.OS === 'web'
        ? {
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
          }
        : {},
  };
}
