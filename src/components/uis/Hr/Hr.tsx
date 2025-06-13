import React from 'react';
import styled from '@emotion/native';
import {isEmptyObject} from '../../../utils/theme';

const StyledHr = styled.View`
  height: 0.5px;
  width: 100%;
  background-color: ${({theme}) => {
    if (isEmptyObject(theme)) {
      return theme.role.border;
    }

    return theme.role.border;
  }};
`;

// Memoized Hr component for performance optimization
export const Hr = React.memo(StyledHr);
