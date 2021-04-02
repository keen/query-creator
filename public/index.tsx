import React from 'react';
import ReactDOM from 'react-dom';
import createI18n from '../src/i18n';
import QueryCreator from '../src/QueryCreator';
import { TranslationsSettings } from '../src/types';
import config from '../config';

type Props = {
  /** Translations */
  translations?: TranslationsSettings;
};
class App extends React.Component<Props> {
  constructor(props) {
    super(props);
    createI18n(this.props.translations);
  }

  onUpdateQuery(query, isQueryReady) {
    console.log(query, isQueryReady);
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
        defaultTimezoneForQuery="Asia/Anadyr"
        disableTimezoneSelection={false}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
