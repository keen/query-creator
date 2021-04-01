import { createGlobalStyle } from 'styled-components';
import { UI_LAYERS } from '@keen.io/ui-core';
const GlobalStyles = createGlobalStyle<{ modalContainer: string }>`
  ${(props) => props.modalContainer} {
    position: absolute;
    z-index: ${UI_LAYERS.modal};
    top: 0;
    left: 0;
  }
`;
export default GlobalStyles;
