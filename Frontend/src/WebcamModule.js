import { useRef } from "react";
import "./WebcamModule.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";

function WebcamModule({ setIsGazing, warning }) {
  const webcamRef = useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 255, height: 255 },
      scale: 1,
    });
    setInterval(() => {
      detect(net);
    }, 100);
  };

  let left = 0,
    right = 0;

  const detect = async (net) => {
    if (
      typeof webcamRef.current != "undefined" &&
      webcamRef.current != null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const face = await net.estimateFaces(video);
      // console.log(face[0].annotations.leftEyeLower0[3][0]);
      // console.log(face[0].annotations.rightEyeLower0[3][0]);

      if (face[0] === undefined || face[0] == null || !face[0]) {
        return;
      }

      /*no face is found

      face[0] will be undefined

      */

      /*

      10 times per second

      */

      if (
        face[0].annotations.leftEyeLower0[3][0] > 400 ||
        face[0].annotations.rightEyeLower0[3][0] > 300
      ) {
        console.log("LEFT");
        left++;
        right = 0;
        if (left >= 200) {
          setIsGazing(true);
          // console.log("CHEATING");
        }
        // console.log(left);
      } else if (
        face[0].annotations.rightEyeLower0[3][0] < 200 ||
        face[0].annotations.leftEyeLower0[3][0] < 235
      ) {
        console.log("RIGHT");
        right++;
        left = 0;
        if (right >= 200) {
          // console.log("Cheating Right");
          setIsGazing(true);
        }
        console.log(right);
      } else {
        left = 0;
        right = 0;
        setIsGazing(false);
      }
    }
  };

  runFacemesh();
  return (
    <div className="Webcam-module">
      <Webcam
        // mirrored={true}
        ref={webcamRef}
        style={{
          width: 255,
          height: 255,
        }}
      ></Webcam>
      <Warning warning={warning} />
    </div>
  );
}

function Warning({ warning }) {
  return (
    <div className="warning">
      <h1>{`Warnings: ${warning}/5`}</h1>
    </div>
  );
}

export default WebcamModule;
