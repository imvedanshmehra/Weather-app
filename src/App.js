import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import "./App.css";

const DayCard = ({ reading }) => {
  var moment = require("moment");
  let newDate = new Date();
  const weekday = reading.dt * 1000;
  newDate.setTime(weekday);

  return (
    <div className="col">
      <div className="card">
        <h3>{moment(newDate).format("dddd")}</h3>
        <p>{moment(newDate).format("MMMM Do, h:mm a")}</p>
        <h2>{Math.round(reading.main.temp)} °C</h2>
        <div>
          <p>{reading.weather[0].description}</p>
        </div>
      </div>
    </div>
  );
};

function Loading() {
  return <div className="spinner-border"></div>;
}

class WeekContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullData: [],
      dailyData: [],
      query: "",
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(address) {
    this.setState({ query: address });
  }
  handleSubmit(e) {
    this.setState({ loading: true });
    e.preventDefault();
    const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.query}&units=metric&appid=5a4c64fb6b932a750cadca3c5fe8e44a
    `;

    fetch(weatherURL)
      .then((res) => res.json())
      .then((data) => {
        const dailyData = data.list.filter((reading) =>
          reading.dt_txt.includes("18:00:00")
        );

        this.setState({
          fullData: data.list,
          dailyData: dailyData,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("Cannot find, Please try different keyword");
      });
  }

  formatDayCards = () => {
    return this.state.dailyData.map((reading, index) => (
      <DayCard reading={reading} key={index} />
    ));
  };
  render() {
    return (
      <div>
        <h1 className="head"> 5- Days Weather Forecast</h1>
        <form onSubmit={this.handleSubmit}>
          <PlacesAutocomplete
            value={this.state.query}
            onChange={this.handleChange}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    className: "input-box",
                  })}
                />
                <span>
                  <button className="btn btn-primary " type="submit">
                    Search
                    {this.state.loading ? <Loading /> : console.log("Loaded!!")}
                  </button>
                </span>
                <div className="autocomplete-dropdown-container">
                  {loading && <div className="spinner-border"></div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "text-primary"
                      : "text";
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, { className })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </form>
        {this.formatDayCards()}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="app">
        <WeekContainer />
      </div>
    );
  }
}

export default App;
