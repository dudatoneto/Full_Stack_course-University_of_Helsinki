import { useState } from "react";
import { Filter, AddPerson, Persons } from "./components/Phonebook";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState([...persons]);

  function handleNameChange(event) {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  function handleNumberChange(event) {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  }

  function handlePersonFilter(event) {
    console.log(event.target.value);

    const filteredNmaes = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );

    setPersonFilter(filteredNmaes);
  }

  function addPerson(event) {
    event.preventDefault();

    if (!newName || !newNumber) alert(`name or number is missing`);
    else if (
      persons.find(
        (person) =>
          person.name.toLocaleLowerCase() == newName.toLocaleLowerCase()
      )
    )
      alert(`${newName} has been already added to the phonebook`);
    else if (persons.find((person) => person.number == newNumber))
      alert(`${newNumber} has been already added to the phonebook`);
    else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      setPersons(persons.concat(personObject));
      setPersonFilter(persons.concat(personObject));
      setNewName("");
      setNewNumber("");
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handlePersonFilter={handlePersonFilter} />
      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <AddPerson
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
        />
      </form>
      <h2>Numbers</h2>
      <Persons persons={personFilter} />
    </div>
  );
};

export default App;
