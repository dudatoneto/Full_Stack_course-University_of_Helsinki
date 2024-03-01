import axios from "axios";

const API_KEY = import.meta.env.API_KEY;
const BASE_URL = "https://studies.cs.helsinki.fi/restcountries/api/";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
const LAT_LON_URL = "http://api.openweathermap.org/geo/1.0/direct?";

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

async function getWeather(capital) {
  const normalized_capital = capital
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  let { lat: capital_lat, lon: capital_lon } = await getLatLon(
    normalized_capital
  );
  return axios
    .get(WEATHER_URL + normalized_capital, {
      params: { lat: capital_lat, lon: capital_lon, appid: API_KEY },
    })
    .then((response) => {
      console.log("fetched the weather successfully");
      return response.data;
    })
    .catch((error) => console.log(error));
}

function getLatLon(capital) {
  //const normalized_capital = capital.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return axios
    .get(LAT_LON_URL, { params: { q: capital, appid: API_KEY } })
    .then((response) => {
      console.log("fetched latitude and longitude successfully");
      return { lat: response.data[0].lat, lon: response.data[0].lon };
    })
    .catch((error) => console.log(error));
}

export default { getAllCountries, getCountry, getWeather };
