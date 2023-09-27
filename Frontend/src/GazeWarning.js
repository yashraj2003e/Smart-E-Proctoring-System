import warning from "./warning.png";
import "./FullScreenWarn.css";

export default function GazeWarning({ setWarning, setIsGazing }) {
  return (
    <div className="app-div">
      <div className="warning-div">
        <img className="img-warn" src={warning} alt="warning"></img>
        <h1>Please look into the Screen !</h1>
        <button
          onClick={() => {
            setWarning((f) => f + 1);
            setIsGazing(false);
          }}
        >
          Okay
        </button>
      </div>
    </div>
  );
}
