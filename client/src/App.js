import './App.css';
import {useState,useEffect} from 'react'
import { fabric } from 'fabric'

import ReconnectingWebSocket from 'reconnecting-websocket';
const sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket("ws://localhost:8080");
const connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
const doc = connection.get('examples', 'counter');

let rect = new fabric.Rect({
  left: 100,
  top: 50,
  fill: 'yellow',
  width: 200,
  height: 100,
  // objectCaching: false,
  // stroke: 'lightgreen',
  // strokeWidth: 4,
});



function App() {
  const [num,setNum] = useState()
  const [canvas, setCanvas] = useState('');
  const initCanvas = () => (
      new fabric.Canvas('canvas', {
        height: 800,
        width: 800,
        backgroundColor: 'pink'
      })
  );

  useEffect(()=>{
    // Get initial value of document and subscribe to changes
    doc.subscribe(showNumbers);
    // When document changes (by this client or any other, or the server),
    // update the number on the page
    doc.on('op', showNumbers);

    setCanvas(initCanvas());

  },[connection])

  function increment() {
    // Increment `doc.data.numClicks`. See
    // https://github.com/ottypes/json0 for list of valid operations.
    doc.submitOp([{p: ['numClicks'], na: 1}]);
    canvas.add(rect)
  }
  const showNumbers =()=>{
    setNum(doc.data.numClicks)
    document.querySelector('#click').textContent = doc.data.numClicks;
  }

  return (
    <div className="App">
      <span id="click"></span>
      <button onClick={increment}> +1</button>
      {num}
      <br></br>
      <canvas id='canvas' style={{border:'solid'}}></canvas>
    </div>
  );
}

export default App;
