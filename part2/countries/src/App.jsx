import { useState, useEffect } from "react";
import countriesService from "./services/countries";
import { Filter, ShowCountries, ShowCountry } from "./components/Countries";

function App() {
  const [countries, setCountries] = useState(null);
  const [countriesFilter, setCountriesFilter] = useState(null);
  const [countrySelected, setCountrySelected] = useState(null);

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
  }

  const handleCountrySelection = () => {
    if (countriesFilter && countriesFilter.length === 1) {
      countriesService
        .getCountry(countriesFilter[0])
        .then((countryData) => {
          setCountrySelected(countryData);
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(getCountries, []);
  useEffect(handleCountrySelection, [countriesFilter]);

  return (
    <div>
      <Filter handleCountryFilter={handleCountryFilter} />
      <ShowCountries countries={countriesFilter} />
      <ShowCountry countryData={countrySelected} />
    </div>
  );
}

export default App;
