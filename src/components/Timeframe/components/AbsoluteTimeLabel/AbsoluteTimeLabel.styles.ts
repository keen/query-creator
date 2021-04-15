import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Separator = styled.span`
  padding: 0 3px;
  color: ${transparentize(0.4, colors.blue[500])};
`;

export const Hours = styled.span`
  color: ${colors.black[100]};
  margin-left: 3px;
`;
