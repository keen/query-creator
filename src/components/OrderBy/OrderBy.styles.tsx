import styled from 'styled-components';

import { PropertyItem } from '../PropertyGroup';

export const Section = styled.section`
  display: flex;
  position: relative;
`;

export const StyledPropertyItem = styled(PropertyItem)`
  background: none;
`;

export const SortableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const OrderByContainer = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;

  &[draggable='true'] {
    .drag-handle {
      cursor: grabbing;
    }
  }

  &:last-child {
    margin-right: 0;
  }
`;
