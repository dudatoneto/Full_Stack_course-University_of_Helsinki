const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("password missing!");
  process.exit(1);
}

const PASSWORD = process.argv[2];
const URL = `mongodb+srv://admin:${PASSWORD}@cluster0.1tzvo41.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(URL);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  console.log("phonebook:");
  const findPersons = async () => {
    try {
      const result = await Person.find({});
      result.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
      process.exit();
    } catch (error) {
      console.error("Error retrieving persons:", error);
      mongoose.connection.close();
      process.exit(1);
    }
  };

  findPersons();
} else if (process.argv.length < 5) {
  console.log("information of person missing!");
  process.exit(1);
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
