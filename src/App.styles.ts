import styled from 'styled-components';
import {
  layout,
  flexbox,
  space,
  LayoutProps,
  SpaceProps,
  FlexDirectionProps,
} from 'styled-system';
import { colors } from '@keen.io/colors';

export const ModifiersSettings = styled.div<FlexDirectionProps>`
  display: flex;
  flex-wrap: wrap;
  gap: 15px 30px;

  ${flexbox};
`;

export const ModifiersItem = styled.div<LayoutProps & SpaceProps>`
  ${layout};
  ${space};
`;

export const LimitContainer = styled.div`
  max-width: 100px;
`;

export const Container = styled.div`
  padding: 25px 20px;

  display: flex;
  flex-direction: column;
  row-gap: 15px;

  background-color: ${colors.white[500]};
`;
