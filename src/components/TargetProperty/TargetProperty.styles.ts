import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  position: relative;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Subtitle = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  color: ${transparentize(0.5, colors.black[100])};
  display: flex;
  align-items: center;
  transform: translateX(0) translateY(-2px);
`;

export const SubtitleIcon = styled.div`
  transform: translateX(5px) translateY(2px);
`;

export const PropertyOverflow = styled.div`
  overflow: hidden;
`;

export const TooltipMotionIconBold = styled.span`
  display: inline;
  font-family: 'Lato Bold', sans-serif;
`;

export const TooltipContainer = styled.div`
  display: inline-block;
  margin-left: 5px;
  position: relative;
  cursor: pointer;
`;
