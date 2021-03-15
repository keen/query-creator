import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  position: relative;
  width: 285px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const IntervalContainer = styled.div`
  display: flex;

  div + button {
    margin-left: 10px;
  }
`;

export const DropdownContainer = styled.div`
  border-top: solid 1px ${colors.white[300]};
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  margin-left: 5px;
  left: 100%;
  top: 0;
  width: 250px;
  z-index: ${UI_LAYERS.tooltip};
`;

export const TooltipContainer = styled.div`
  display: inline-block;
  margin-left: 5px;
  position: relative;
  cursor: pointer;
`;

export const DropdownWrapper = styled.div`
  width: 300px;
  position: absolute;
  bottom: 148px;
  right: -170px;
`;
