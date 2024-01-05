import axios from "axios";

const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api/";

function getAllCountries() {
  return axios.get(BASE_URL + "all").then((response) => {
    console.log("fetched all countries successfully");
    return response.data;
  });
}

function getCountry(name) {
  return axios.get(`${BASE_URL}name/${name}`).then((response) => {
    console.log("fetched the country successfully");
    return response.data;
  });
}

export default { getAllCountries, getCountry };
