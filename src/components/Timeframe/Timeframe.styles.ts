import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  position: relative;
`;

export const SettingsContainer = styled.div`
  padding: 15px 10px;
  border-top: solid 1px ${colors.white[300]};
  border-bottom: solid 1px ${colors.white[300]};
`;

export const Notification = styled.div`
  padding: 10px 15px 0;
  color: ${colors.black[100]};
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  text-align: right;
`;
