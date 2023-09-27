import warning from "./warning.png";
import "./FullScreenWarn.css";

export default function FullScreenWarn({ setFullScreen }) {
  function doFullScreen() {
    document.documentElement.requestFullscreen();
    setFullScreen((fullScreen) => !fullScreen);
  }

  return (
    <div className="app-div">
      <div className="warning-div">
        <img className="img-warn" src={warning} alt="warning"></img>
        <h1>Please switch to fullscreen to continue the exam !</h1>
        <button onClick={doFullScreen}>Switch to Full Screen</button>
      </div>
    </div>
  );
}
