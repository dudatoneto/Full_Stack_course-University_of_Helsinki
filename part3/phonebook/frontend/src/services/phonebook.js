import axios from "axios";

const BASE_URL = "/api/persons";

function getData() {
  return axios.get(BASE_URL).then((response) => {
    console.log("fetched all the data successfully");
    return response.data;
  });
}

function addData(newPerson) {
  return axios.post(BASE_URL, newPerson).then((response) => {
    console.log("fetched the data successfully");
  });
}

function deleteData(personId) {
  return axios.delete(`${BASE_URL}/${personId}`).then((response) => {
    console.log("deleted the data successfully");
  });
}

function updateData(id, person) {
  return axios
    .put(`${BASE_URL}/${id}`, person)
    .then((response) => {
      console.log("updated the data successfully");
    });
}

export default { getData, addData, deleteData, updateData };
