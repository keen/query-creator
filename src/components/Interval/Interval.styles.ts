import styled from 'styled-components';
import { colors } from '@keen.io/colors';
import { transparentize } from 'polished';

export const Container = styled.div`
  position: relative;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const IntervalContainer = styled.div`
  position: relative;
  width: 150px;
  margin-right: 10px;
`;

export const DropdownContainer = styled.div`
  border-top: solid 1px ${colors.white[300]};
`;

export const TooltipIconContainer = styled.div`
  display: inline-block;
  margin-left: 5px;
  position: relative;
  cursor: pointer;
`;

export const IntervalManagement = styled.div`
  display: flex;
`;

export const StyledPlaceholder = styled.div`
  color: ${transparentize(0.5, colors.black[300])};
  text-align: center;
  width: 100%;
`;
export const TextCenter = styled.div`
  text-align: center;
  flex: 1;
`;
