import axios from "axios";

const BASE_URL = "http://localhost:3000/persons";

const getData = () => {
  return axios.get(BASE_URL).then((response) => {
    return response.data;
  });
};

const addData = (newPerson) => {
  return axios.post(BASE_URL, newPerson).then(response => response.data);
};

export default { getData, addData };
