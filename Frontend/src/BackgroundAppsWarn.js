import warning from "./warning.png";
import "./FullScreenWarn.css";

export default function BackgroundAppsWarn() {
  return (
    <div className="app-div">
      <div className="warning-div">
        <img className="img-warn" src={warning} alt="warning"></img>
        <h1 style={{ margin: "3%" }}>
          Please close any other browsers and chat applications !
        </h1>
      </div>
    </div>
  );
}
