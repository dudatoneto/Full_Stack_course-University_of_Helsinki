import { useState, useEffect } from "react";
import countriesService from "./services/countries";
import { Filter, ShowCountries, ShowCountry, ShowWeather } from "./components/Countries";

function App() {
  const [countries, setCountries] = useState(null);
  const [countriesFilter, setCountriesFilter] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);
  const [capitalWeather, setCapitalWeather] = useState(null);

  const getCountries = () => {
    countriesService
      .getAllCountries()
      .then((countries) => {
        let countriesArray = countries.map((country) => {
          return country.name.common;
        });
        setCountries(countriesArray);
        setCountriesFilter(countries);
      })
      .catch((error) => console.log(error));
  };

  function handleCountryFilter(event) {
    console.log(event.target.value);

    const filteredCountries = countries.filter((country) =>
      country.toLowerCase().includes(event.target.value.toLowerCase())
    );

    setCountriesFilter(filteredCountries);
    setCountrySelected(null);
    setCapitalWeather(null);
  }

  const handleCountrySelection = () => {
    if (countriesFilter && countriesFilter.length === 1) {
      countriesService
        .getCountry(countriesFilter[0])
        .then((countryData) => {
          setCountrySelected(countryData);
          handleWeather(countryData.capital[0])
        })
        .catch((error) => console.log(error));
    }
  };

  const handleShowButton = (country) => {
    countriesService
      .getCountry(country)
      .then((countryData) => {
        setCountrySelected(countryData);
        handleWeather(countryData.capital[0])
      })
      .catch((error) => console.log(error));
  };

  const handleWeather = (capital) => {
    countriesService
      .getWeather(capital)
      .then((weatherData) => {
        setCapitalWeather(weatherData);
      })
      .catch((error) => console.log(error));
  };

  useEffect(getCountries, []);
  useEffect(handleCountrySelection, [countriesFilter]);

  return (
    <div>
      <Filter handleCountryFilter={handleCountryFilter} />
      <ShowCountries
        countries={countriesFilter}
        handleShowButton={handleShowButton}
      />
      <ShowCountry countryData={countrySelected} />
      <ShowWeather weatherData={capitalWeather}/>
    </div>
  );
}

export default App;
