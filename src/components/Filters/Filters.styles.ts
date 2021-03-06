import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const Operator = styled.div`
  margin: 6px 0;
`;

export const FiltersSettings = styled.div`
  margin-bottom: 20px;
`;

export const ActionContainer = styled.div<{ hasSpacing: boolean }>`
  ${(props) =>
    props.hasSpacing &&
    css`
      margin-top: 5px;
    `};
`;

export const Wrapper = styled.div<{ isDisabled: boolean }>`
  position: relative;
  display: ${(props) => (props.isDisabled ? 'inline-block' : 'block')};
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  left: 100%;
  top: -50%;
  transform: translateX(10px) translateY(-10px);
  z-index: ${UI_LAYERS.tooltip};
`;

export const Container = styled.div`
  padding: 15px 0;
  border-top: 1px solid ${colors.gray[300]};
  border-bottom: 1px solid ${colors.gray[300]};

  &:last-child {
    border-bottom: none;
  }
`;
