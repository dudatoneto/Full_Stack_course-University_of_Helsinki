import axios from "axios";

const BASE_URL = "http://localhost:3000/persons";

const getData = () => {
  return axios.get(BASE_URL).then((response) => {
    console.log("fetched all the data successfully");
    return response.data;
  });
};

const addData = (newPerson) => {
  return axios.post(BASE_URL, newPerson).then((response) => {
    console.log("fetched the data successfully");
  });
};

const deleteData = (personId) => {
  return axios.delete(`${BASE_URL}/${personId}`).then((response) => {
    console.log("deleted the data successfully");
  });
};

export default { getData, addData, deleteData };
