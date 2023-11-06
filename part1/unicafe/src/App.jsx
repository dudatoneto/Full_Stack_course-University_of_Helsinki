import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <td>
        {text}
      </td>
      <td>
        {value}
      </td>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  function calcAverage(good, neutral, bad) {
    if (good + neutral + bad > 0) return (good - bad) / (good + neutral + bad);
    else return 0;
  }

  function calcPositivePercentage(good, neutral, bad) {
    if (good + neutral + bad > 0)
      return (good / (good + neutral + bad)) * 100 + "%";
    else return "0%";
  }

  if (good + neutral + bad > 0)
    return (
      <table>
        <tbody>
        <tr>
          <StatisticLine text={"good"} value={good} />
        </tr>
        <tr>
          <StatisticLine text={"neutral"} value={neutral} />
        </tr>
        <tr>
          <StatisticLine text={"bad"} value={bad} />
        </tr>
        <tr>
          <StatisticLine text={"all"} value={good + neutral + bad} />
        </tr>
        <tr>
          <StatisticLine
            text={"average"}
            value={calcAverage(good, neutral, bad)}
          />
        </tr>
        <tr>
          <StatisticLine
            text={"positive"}
            value={calcPositivePercentage(good, neutral, bad)}
          />
        </tr>
        </tbody>
      </table>
    );
  else
    return (
      <>
        <p>No feedback given</p>
      </>
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
      <Button handleClick={handleGoodClick} text={"good"} />
      <Button handleClick={handleNeutralClick} text={"neutral"} />
      <Button handleClick={handleBadClick} text={"bad"} />
      <div>
        <h2>statistics</h2>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </div>
  );
};

export default App;
