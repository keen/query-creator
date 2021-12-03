/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

const AppContext = React.createContext<{
  modalContainer: string;
  onUpdateChartSettings: (chartSettings: Record<string, any>) => void;
  keenClient?: any;
}>({
  modalContainer: null,
  onUpdateChartSettings: () => {},
  keenClient: {},
});

export default AppContext;
