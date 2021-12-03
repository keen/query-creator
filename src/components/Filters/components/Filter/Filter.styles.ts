import styled from 'styled-components';

export const FilterItem = styled.div`
  max-width: 60%;
  min-width: 0;
`;

export const Container = styled.div`
  display: flex;

  ${FilterItem} + ${FilterItem} {
    margin-left: 5px;

    &:empty {
      display: none;
    }
  }
`;

export const FilterInput = styled.div`
  position: relative;
  max-width: 200px;
  min-width: 0;
  margin-left: 5px;
  margin-right: 5px;
`;
