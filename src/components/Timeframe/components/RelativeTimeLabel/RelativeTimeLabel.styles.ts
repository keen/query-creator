import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const IncludesToday = styled.span`
  margin-left: 3px;
  color: ${transparentize(0.4, colors.blue[500])};
`;
