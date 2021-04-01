import { createGlobalStyle } from 'styled-components';
import { UI_LAYERS } from '@keen.io/ui-core';

const GlobalStyles = createGlobalStyle<{ modalContainer: string }>`
  ${(props) => props.modalContainer} {
    z-index: ${UI_LAYERS.modal};
  }
`;

export default GlobalStyles;
