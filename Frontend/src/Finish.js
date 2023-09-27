function Finish({ points, maxPoints, dispatch }) {
  const percentage = (points / maxPoints) * 100;
  return (
    <p className="result">
      You scored <strong>{points}</strong> out of {maxPoints} (
      {Math.ceil(percentage)}%)
    </p>
  );
}

export default Finish;
