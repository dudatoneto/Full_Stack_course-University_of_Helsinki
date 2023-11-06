import { useState } from "react";

const Statistics = ({good, neutral, bad}) => {
  function calcAverage(good, neutral, bad) {
    if (good + neutral + bad > 0) return (good - bad) / (good + neutral + bad);
    else return 0;
  }

  function calcPositivePercentage(good, neutral, bad) {
    if (good + neutral + bad > 0) return (good / (good + neutral + bad)) * 100;
    else return 0;
  }

  return (
    <div>
      <h2>statistics</h2>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {good + neutral + bad}</p>
      <p>average {calcAverage(good, neutral, bad)}</p>
      <p>positive {calcPositivePercentage(good, neutral, bad)}%</p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  );
};

export default App;
