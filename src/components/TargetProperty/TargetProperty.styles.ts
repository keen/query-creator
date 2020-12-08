import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  position: relative;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const PropertyOverflow = styled.div`
  overflow: hidden;
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 100%;
  width: 320px;
  transform: translateX(0) translateY(5px);
  z-index: ${UI_LAYERS.tooltip};
`;

export const TooltipContainer = styled.div`
  display: inline-block;
  margin-left: 5px;
  position: relative;
  cursor: pointer;
`;
