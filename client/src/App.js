import './App.css';
import {useState,useEffect} from 'react'

import ReconnectingWebSocket from 'reconnecting-websocket';
const sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket("ws://localhost:8080");
const connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
const doc = connection.get('examples', 'counter');

function increment() {
  // Increment `doc.data.numClicks`. See
  // https://github.com/ottypes/json0 for list of valid operations.
  doc.submitOp([{p: ['numClicks'], na: 1}]);
}

const showNumbers =()=>{
  document.querySelector('#click').textContent = doc.data.numClicks;
}

function App() {

  useEffect(()=>{
    // Get initial value of document and subscribe to changes
    doc.subscribe(showNumbers);
    // When document changes (by this client or any other, or the server),
    // update the number on the page
    doc.on('op', showNumbers);
  },[connection])
  return (
    <div className="App">
      <span id="click"></span>
      <button onClick={increment}> +1</button>
    </div>
  );
}

export default App;
