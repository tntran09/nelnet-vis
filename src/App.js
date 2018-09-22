import React from 'react';
import './App.css';
import GraphSvg from './GraphSvg';
import { groups, payments } from './data.json';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Nelnet-vis</h1>
        </header>
        <GraphSvg groups={groups} payments={payments} />
      </div>
    );
  }
}

export default App;
