const WEATHER_ICON_URL = "http://openweathermap.org/img/wn/"

const Filter = ({ handleCountryFilter }) => {
  return (
    <div style={{ paddingBottom: "5px" }}>
      find countries <input name="filter" onChange={handleCountryFilter} />
    </div>
  );
};

const ShowCountries = ({ countries, handleShowButton }) => {
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
          <div
            key={country}
            style={{ display: "flex", height: "1.8rem", alignItems: "center" }}
          >
            <p key={`name-${country}`}>{country}</p>
            <button
              key={`show-${country}`}
              type="button"
              style={{ marginLeft: "11px" }}
              onClick={() => handleShowButton(country)}
            >
              show
            </button>
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
        <p styles={{ fontSize: "20px" }}><b>{countryData.name.common}</b></p>
        <p>capital: {countryData.capital.join(", ")}</p>
        <p>area: {countryData.area}</p>
        <p>languages: {Object.values(countryData.languages).join(", ")}</p>
        <img src={countryData.flags.png} />
      </div>
    );
  }

  return null;
};

const ShowWeather = ({ weatherData }) => {
  if (weatherData) {
    return (
      <div>
        <p styles={{ fontSize: "20px" }}>Weather in {weatherData.name}</p>
        <p>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)} Celsius</p>
        <p>Description: {weatherData.weather[0].description}</p>
        <img src={WEATHER_ICON_URL + weatherData.weather[0].icon + "@4x.png"} />
      </div>
    );
  }

  return null;
};

export { Filter, ShowCountries, ShowCountry, ShowWeather };
