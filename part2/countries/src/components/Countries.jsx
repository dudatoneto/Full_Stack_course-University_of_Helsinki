const Filter = ({ handleCountryFilter }) => {
  return (
    <div>
      find countries <input name="filter" onChange={handleCountryFilter} />
    </div>
  );
};

const ShowCountries = ({ countries }) => {
  if (!countries) {
    return null;
  }
  if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, especify another filter</p>
      </div>
    );
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country}>
            <p key={country}>{country}</p>
          </div>
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    return null;
  } else {
    return (
      <div>
        <p>No matches!</p>
      </div>
    );
  }
};

const ShowCountry = ({ countryData }) => {
  if (countryData) {
    return (
      <div>
        <p>{countryData.name.common}</p>
        <p>capital: {countryData.capital.join(', ')}</p>
        <p>area: {countryData.area}</p>
        <p>languages: {Object.values(countryData.languages).join(', ')}</p>
        <img src={countryData.flags.png}/>
      </div>
    );
  }

  return null;
};

export { Filter, ShowCountries, ShowCountry };
