/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

const AppContext = React.createContext<{
  modalContainer: string;
  onUpdateChartSettings: (chartSettings: Record<string, any>) => void;
  keenClient?: any;
  disableFilterSuggestions?: boolean;
}>({
  modalContainer: null,
  onUpdateChartSettings: () => {},
  keenClient: {},
  disableFilterSuggestions: false,
});

export default AppContext;
