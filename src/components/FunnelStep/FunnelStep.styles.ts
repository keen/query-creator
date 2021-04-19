import styled, { css } from 'styled-components';
import { layout, LayoutProps } from 'styled-system';
import { colors } from '@keen.io/colors';
import Card from '../Card';

export const SmallItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 140px;
  padding-top: 20px;

  label > div {
    margin-right: 10px;
  }
`;

export const Item = styled.div`
  flex: 1;
  max-width: 320px;
  min-width: 285px;
`;

export const Wrapper = styled.div<LayoutProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 0 20px 0;
  grid-gap: 20px;

  ${layout};
`;

export const CardWrapper = styled(Card)`
  ${Wrapper} + ${Wrapper} {
    border-top: 1px solid ${colors.white[300]};
  }
`;

export const StepContainer = styled.div<{
  isDragged?: boolean;
}>`
  cursor: ${(props) => (props.isDragged ? 'grabbing' : 'grab')};

  ${CardWrapper} + ${CardWrapper} {
    border-top: 1px solid ${colors.white[300]};
  }
`;

export const StepHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  font-family: Lato Bold, sans-serif;
`;

export const StepTitle = styled.div<{
  hasError?: boolean;
}>`
  color: ${colors.black[100]};

  ${(props) =>
    props.hasError &&
    css`
      color: ${colors.red[500]};
    `};
`;

export const IconContainer = styled(StepHeader)`
  margin-right: 10px;
`;

export const Settings = styled(StepHeader)`
  margin-left: auto;
`;

export const HintHighlight = styled.div`
  margin-top: 15px;
  font-family: Lato Bold, sans-serif;
`;

export const Clone = styled(StepHeader)`
  color: ${colors.blue[100]};
  font-family: Lato Bold, sans-serif;
  font-size: 14px;
  cursor: pointer;
`;

export const Close = styled(StepHeader)`
  margin-left: 21px;
  cursor: pointer;
`;

export const StepName = styled.span`
  margin-left: 10px;
  color: ${colors.blue[500]};
  font-family: Lato Medium, sans-serif;
  font-size: 14px;
`;

export const Incomplete = styled.span`
  color: ${colors.red[200]};
  font-size: 14px;
  font-family: Lato Semibold, sans-serif;
  margin-left: 10px;
`;
