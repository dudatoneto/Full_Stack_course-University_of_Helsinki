const morgan = require("morgan");
const express = require("express");
const app = express();

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-lenght] :response-time ms :data")
);

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`
    <div>
      <p>Phonebook has info for ${phonebook.length} people</p>
      <p>${date}</p>
    </div>
  `);
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    console.log(`There is no person with the id ${id}`);
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const initialLength = phonebook.length;
  phonebook = phonebook.filter((person) => person.id !== id);

  if (phonebook.length < initialLength) {
    console.log(`Person with the id ${id} deleted`);
    response.status(204).end();
  } else {
    console.log(`There is no person with the id ${id}`);
    response.status(404).end();
  }
});

const generateId = () => {
  notUsedId = false;
  newId = 0;

  if (phonebook.length > 0) {
    while (!notUsedId) {
      newId = Math.floor(Math.random() * 1000);
      if (!phonebook.find((person) => person.id === newId)) notUsedId = true;
    }
  }
  return newId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  if (phonebook.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);

  console.log(`Added ${person.name} to phonebook`);
  response.json(person);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
