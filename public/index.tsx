import React from 'react';
import ReactDOM from 'react-dom';
import QueryCreator from '../src/QueryCreator';
import config from '../config';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  onUpdateQuery(query) {
    console.log(query);
  }

  onUpdateChartSettings(chartSettings) {
    console.log(chartSettings);
  }

  render() {
    const { projectId, masterKey, readKey, host } = config;
    const modalContainer = '#modal-root';
    return (
      <QueryCreator
        modalContainer={modalContainer}
        projectId={projectId}
        readKey={readKey}
        masterKey={masterKey}
        host={host}
        onUpdateQuery={this.onUpdateQuery}
        onUpdateChartSettings={this.onUpdateChartSettings}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
