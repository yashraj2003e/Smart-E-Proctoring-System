function NextButton({ children, dispatch, answer, index, numQuestions }) {
  if (answer === null) return null;

  function handleClick() {
    if (index === numQuestions - 1) {
      dispatch({ type: "finished" });
    } else {
      dispatch({ type: "nextQuestion" });
    }
  }

  return (
    <button className="btn btn-ui" onClick={handleClick}>
      {children}
    </button>
  );
}

export default NextButton;
