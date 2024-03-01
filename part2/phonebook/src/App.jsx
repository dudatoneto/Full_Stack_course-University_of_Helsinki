import { useState, useEffect } from "react";
import {
  Filter,
  AddPerson,
  Persons,
  Notification,
} from "./components/Phonebook";
import phonebookService from "./services/phonebook";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState([...persons]);
  const [message, setMessage] = useState({ message: null, error: false });

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
    else {
      const foundPerson = persons.find(
        (person) =>
          person.name.toLocaleLowerCase() == newName.toLocaleLowerCase()
      );
      if (foundPerson) {
        if (
          window.confirm(
            `${foundPerson.name} is aleady added to phonebook, replace the old number with a new one?`
          )
        ) {
          phonebookService
            .updateData(foundPerson.id, newNumber)
            .then(() => {
              setMessage({
                message: `contact ${newName} was updated successfully`,
                error: false,
              });
              setTimeout(() => {
                setMessage({ message: null, error: false });
              }, 7000);
            })
            .catch((error) => {
              setMessage({
                message: `information of ${newName} has already been removed from server`,
                error: true,
              });
              setTimeout(() => {
                setMessage({ message: null, error: false });
              }, 7000);
            });
          getPersons();
        }
      } else if (persons.find((person) => person.number == newNumber))
        alert(`${newNumber} has been already added to the phonebook`);
      else {
        const newPerson = {
          name: newName,
          number: newNumber,
        };

        phonebookService
          .addData(newPerson)
          .then(() => {
            setMessage({
              message: `contact ${newName} was added to the phonebook successfully`,
              error: false,
            });
            setTimeout(() => {
              setMessage({ message: null, error: false });
            }, 7000);
          })
          .catch((error) => console.log(error));

        getPersons();
        setNewName("");
        setNewNumber("");
      }
    }
  }

  function handleDeletePerson(name) {
    if (window.confirm(`Delete ${name}?`)) {
      const deletePerson = persons.find((person) => person.name == name);

      phonebookService
        .deleteData(deletePerson.id)
        .then(() => {
          setMessage({
            message: `contact ${newName} was deleted from the phonebook successfully`,
            error: false,
          });
          setTimeout(() => {
            setMessage({ message: null, error: false });
          }, 7000);
        })
        .catch((error) => console.log(error));

      getPersons();
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
      <Persons persons={personFilter} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
