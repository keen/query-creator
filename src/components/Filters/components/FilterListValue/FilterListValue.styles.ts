import styled from 'styled-components';
import { layout, LayoutProps } from 'styled-system';

export const Container = styled.div`
  position: relative;
`;

export const DropdownContainer = styled.div`
  width: 280px;
  padding: 14px;
  box-sizing: border-box;
`;

export const ItemContainer = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ListItem = styled.div`
  margin-top: 6px;
  margin-right: 10px;
`;

export const List = styled.div<LayoutProps>`
  display: flex;
  flex-wrap: wrap;

  overflow: auto;
  ${layout};
`;
