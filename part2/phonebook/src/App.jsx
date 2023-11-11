import { useState } from "react";

const Person = ({ name }) => {
  return (
    <>
      <p>{name}</p>
    </>
  );
};

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.name} name={person.name} />
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  function handleNameChange(event) {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  function addName(event) {
    event.preventDefault();

    if (persons.find((person) => person.name == newName))
      alert(`${newName} has been already added to the phonebook`);
    else {
      const personObject = {
        name: newName,
      };
      setPersons(persons.concat(personObject));
      setNewName("");
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  );
};

export default App;
