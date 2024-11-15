import './App.scss';

import React from 'react';

import BPMN from './components/BPMN';

function App() {
  return (
    <div className="App">
      <BPMN instanceId={2251799813766397} />
    </div>
  );
}

export default App;
