import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  position: relative;
`;

export const GroupSettings = styled.div`
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

export const SortableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
