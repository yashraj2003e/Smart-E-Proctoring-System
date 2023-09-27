import "./App.css";
import Main from "./Main";
import Header from "./Header";
import { useEffect, useReducer, useRef, useState } from "react";
import Loader from "./Loader";
import Error from "./Error";
import Start from "./Start";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Finish from "./Finish";
import Timer from "./Timer";
import Footer from "./Footer";
import WebcamModule from "./WebcamModule";
import FullScreenWarn from "./FullScreenWarn";
// import DetectBackgroundApps from "./DetectBackgroundApps";
import BackgroundAppsWarn from "./BackgroundAppsWarn";
import GazeWarning from "./GazeWarning";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finished":
      return {
        ...state,
        status: "finished",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const isFullScreen = document.fullscreenElement !== null;
  const [fullScreen, setFullScreen] = useState(isFullScreen);
  const [isRunning, setIsRunning] = useState(false);
  const [warning, setWarning] = useState(0);
  const [isGazing, setIsGazing] = useState(false);
  const warn = useRef(0);

  function checkForFullScreen() {
    const isFullScreen = document.fullscreenElement !== null;
    if (!isFullScreen) {
      setFullScreen(false);
    }
  }

  useEffect(() => {
    function detectWindowChange() {
      if (status !== "finished") {
        if (document.hidden) {
          warn.current = warn.current + 1;
          window.alert(
            `Switching the Window will result in termination of the exam !, warning ${warn.current}/5`
          );
          console.log(warn.current);
        }
        if (Number(warn.current) === 5) {
          dispatch({ type: "finished" });
          warn.current = 0;
        }
      }
    }
    document.addEventListener("fullscreenchange", checkForFullScreen);
    window.addEventListener("visibilitychange", detectWindowChange);

    return () => {
      document.removeEventListener("fullscreenchange", checkForFullScreen);
      window.removeEventListener("visibilitychange", detectWindowChange);
    };
  }, [status]);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((val, s) => val + s.points, 0);

  useEffect(() => {
    fetch("http://localhost:8800/questions")
      .then((data) => data.json())
      .then((res) => dispatch({ type: "dataReceived", payload: res }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  if (status === "finished") {
    const data = {
      id: crypto.randomUUID(),
      score: String(points),
      backgroundApp: "0",
      gazewarnings: String(warning),
      gazereview: warning === 5 ? "yes" : "no",
    };
    async function postResponse() {
      const response = await fetch("http://localhost:8081/exam", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data1 = await response.text();
      console.log(data1);
    }
    postResponse();
  }

  useEffect(() => {
    if (warning === 5 || warn.current === 5) {
      dispatch({ type: "finished" });
    }
  });

  return (
    <div>
      {isGazing ? (
        <GazeWarning setWarning={setWarning} setIsGazing={setIsGazing} />
      ) : isRunning ? (
        <BackgroundAppsWarn />
      ) : fullScreen ? (
        <header>
          <WebcamModule setIsGazing={setIsGazing} warning={warning} />
          <main>
            <Header />
            <Main>
              {status === "loading" && <Loader />}
              {status === "error" && <Error />}
              {status === "ready" && (
                <Start numQuestions={numQuestions} dispatch={dispatch} />
              )}
              {status === "active" && (
                <>
                  <Progress
                    index={index}
                    numQuestion={numQuestions}
                    points={points}
                    maxPoints={maxPoints}
                  />
                  <Questions
                    question={questions[index]}
                    dispatch={dispatch}
                    answer={answer}
                  />
                  <Footer>
                    <Timer
                      dispatch={dispatch}
                      secondsRemaining={secondsRemaining}
                    />
                    <NextButton
                      dispatch={dispatch}
                      answer={answer}
                      index={index}
                      numQuestions={numQuestions}
                    >
                      {index === numQuestions - 1 ? "Finish" : "Next"}
                    </NextButton>
                  </Footer>
                </>
              )}
              {status === "finished" && (
                <Finish
                  points={points}
                  dispatch={dispatch}
                  maxPoints={maxPoints}
                />
              )}
            </Main>
          </main>
        </header>
      ) : status !== "finished" ? (
        <FullScreenWarn setFullScreen={setFullScreen} />
      ) : (
        <Finish points={points} dispatch={dispatch} maxPoints={maxPoints} />
      )}
    </div>
  );
}
