import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  background: ${transparentize(0.85, colors.blue[100])};
`;
