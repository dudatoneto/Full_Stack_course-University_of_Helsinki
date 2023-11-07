import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(8).fill(0));

  function handleNext() {
    setSelected(Math.floor(Math.random() * (7 - 0 + 1)));
  }

  function handleVote() {
    let newArray = [...votes];
    newArray[selected]++;
    setVotes(newArray);
  }

  function mostVoted() {
    let mostVotedIndex = 0;
    for (let i = 0; i < votes.length; i++) {
      if (votes[mostVotedIndex] < votes[i]) mostVotedIndex = i;
    }

    return (
      <>
        <p>{anecdotes[mostVotedIndex]}</p>
        <p>has {votes[mostVotedIndex]} votes</p>
      </>
    );
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {mostVoted()}
    </div>
  );
};

export default App;
