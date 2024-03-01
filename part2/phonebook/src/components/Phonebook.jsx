const Person = ({ name, number }) => {
  return (
    <>
      <p>
        {name} {number}
      </p>
    </>
  );
};

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <div
          key={person.name}
          style={{ display: "flex", height: "1.7rem", alignItems: "center" }}
        >
          <Person
            key={`person-${person.name}`}
            name={person.name}
            number={person.number}
          />
          <DeletePerson
            key={`delete-${person.name}`}
            name={person.name}
            handleDeletePerson={handleDeletePerson}
          />
        </div>
      ))}
    </div>
  );
};

const Filter = ({ handlePersonFilter }) => {
  return (
    <div>
      filter shown with <input name="filter" onChange={handlePersonFilter} />
    </div>
  );
};

const AddPerson = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <>
      <div>
        name: <input name="name" value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number:{" "}
        <input name="number" value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </>
  );
};

const DeletePerson = ({ name, handleDeletePerson }) => {
  return (
    <>
      <button
        type="button"
        onClick={() => handleDeletePerson(name)}
        style={{ marginLeft: "13px" }}
      >
        delete
      </button>
    </>
  );
};

const Notification = ({ message }) => {
  if (message.message === null) {
    return null;
  } else if (message.error) {
    return <div className="error-message">{message.message}</div>;
  }
  return <div className="message">{message.message}</div>;
};

export { Persons, Filter, AddPerson, Notification };
