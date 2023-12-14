import { useState, useEffect } from "react";
import { Filter, AddPerson, Persons } from "./components/Phonebook";
import phonebookService from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState([...persons]);

  const getPersons = () => {
    phonebookService
      .getData()
      .then((persons) => {
        setPersons(persons);
        setPersonFilter(persons);
      })
      .catch((error) => console.log(error));
  };

  useEffect(getPersons, []);

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

    const filteredNames = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );

    setPersonFilter(filteredNames);
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
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      phonebookService.addData(newPerson).catch((error) => console.log(error));

      setPersons(persons.concat(newPerson));
      setPersonFilter(persons.concat(newPerson));
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
