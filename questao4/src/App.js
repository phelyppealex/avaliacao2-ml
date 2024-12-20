import React, {useRef, useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';

function App() {
  // Setup references
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  // Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution:{width: webcamRef.current.video.videoWidth, height: webcamRef.current.video.videoHeight},
      scale:0.8
    });
    setInterval(() => {
      detect(net);
    }, 100)
  };

  // Detect function
  const detect = async (net) =>{
    if(
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ){
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      webcamRef.current.width = videoWidth;
      webcamRef.current.height = videoHeight;

      // Make detections
      const face = await net.estimateFaces(video);
      console.log()
      // Get canvas context for drawing
      const ctx = canvasRef.current.getContext('2d', {willReadFrequently: true});
      drawMesh(face, ctx, webcamRef)
    }
  }

  useEffect(() => {
    runFacemesh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam 
          ref={webcamRef} 
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
      </header>
  </div>
  );
}

export default App;