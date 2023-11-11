import { useState } from "react";

const Person = ({ name, number }) => {
  return (
    <>
      <p>
        {name} {number}
      </p>
    </>
  );
};

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.name} name={person.name} number={person.number} />
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  function handleNameChange(event) {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  function handleNumberChange(event) {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  }

  function addPerson(event) {
    event.preventDefault();

    if (persons.find((person) => person.name == newName))
      alert(`${newName} has been already added to the phonebook`);
    else if (persons.find((person) => person.number == newNumber))
      alert(`${newNumber} has been already added to the phonebook`);
    else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewNumber("");
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input name="name" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:{" "}
          <input
            name="number"
            value={newNumber}
            onChange={handleNumberChange}
          />
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
