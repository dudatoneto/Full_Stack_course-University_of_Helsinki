require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();
const Person = require("./models/phonebook");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-lenght] :response-time ms :data")
);

app.get("/info", async (request, response, next) => {
  try {
    const date = new Date();
    const result = await Person.find({});
    response.send(`
    <div>
      <p>Phonebook has info for ${result.length} people</p>
      <p>${date}</p>
    </div>
  `);
  } catch (err) {
    console.log("Error fetching persons:");
    next(err);
  }
});

app.get("/api/persons", async (request, response, next) => {
  try {
    const result = await Person.find({});
    response.json(result);
  } catch (err) {
    console.log("Error fetching persons:");
    next(err);
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const result = await Person.findById(request.params.id);

    if (result) {
      response.json(result);
    } else {
      console.log(`There is no person with the id ${request.params.id}`);
      response.status(404).end();
    }
  } catch (err) {
    console.log(`Error fetching person with id ${request.params.id}:`);
    next(err);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    const result = await Person.findByIdAndDelete(request.params.id);
    if (result) {
      console.log(`Person with the id ${request.params.id} deleted`);
      response.status(204).end();
    } else {
      console.log(`There is no person with the id ${request.params.id}`);
      response.status(404).end();
    }
  } catch (err) {
    console.error("Error deleting person:");
    next(err);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  try {
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    await person.save();

    console.log(`Added ${person.name} to phonebook`);
    response.json(person);
  } catch (err) {
    console.error(`Error creating person ${body.name}:`);
    next(err);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  try {
    const person = {
      name: request.body.name,
      number: request.body.number,
    };

    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
    );

    if (updatedPerson) {
      response.json(updatedPerson);
    } else {
      console.log(`There is no person with the id ${request.params.id}`);
      response.status(404).end();
    }
  } catch (err) {
    console.log(`Error fetching person with id ${request.params.id}:`);
    next(err);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    console.log("*** malformatted id ***");
    console.error(error.message);
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("*** name attribute has to be at least 3 chars long ***");
    console.error(error.message);
    return response.status(400).json({ error: error.message });
  }

  console.error(error.message);

  response.status(500).end();
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 