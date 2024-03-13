require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();
const Person = require("./models/phonebook");

let phonebook = [];

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-lenght] :response-time ms :data")
);

app.get("/info", async (request, response) => {
  const date = new Date();
  const result = await Person.find({});
  response.send(`
    <div>
      <p>Phonebook has info for ${result.length} people</p>
      <p>${date}</p>
    </div>
  `);
});

app.get("/api/persons", async (request, response) => {
  const result = await Person.find({});
  response.json(result);
});

app.get("/api/persons/:id", async (request, response) => {
  const result = await Person.findById(request.params.id);

  if (result) {
    response.json(result);
  } else {
    console.log(`There is no person with the id ${request.params.id}`);
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  try {
    const result = await Person.findByIdAndDelete(request.params.id);
    if (result) {
      console.log(`Person with the id ${request.params.id} deleted`);
      response.status(204).end();
    } else {
      console.log(`There is no person with the id ${id}`);
      response.status(404).end();
    }
  } catch (err) {
    console.error("Error deleting person:", err);
    response.status(500);
  }
});

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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save();

  console.log(`Added ${person.name} to phonebook`);
  response.json(person);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
