var express = require('express');
var request = require('request-promise-native');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

var forecastIOKey = "XXX"; // FIXME : replace with your API key gained from forecast.io

function requestTemperature() {
  var url = "https://api.forecast.io/forecast/" + forecastIOKey + "/-41.2865,174.7762";

  return request({url: url, json: true}).then(data => {
    var temperature = data.currently.temperature;
    var celsius = (temperature - 32) * 5 / 9;

    return Math.round(celsius * 10) / 10;
  });
};

function determineFood(temperature) {
  if (temperature > 21) {
    return "ice cream";
  }
  else {
    return "fried noodles";
  }
}

app.get("/", (req, res) => {
  requestTemperature().then(temperature => {
    var food = determineFood(temperature);
    var variables = {temperature, food};
    res.render("index.html.ejs", variables);
  });
});

app.listen(3000);
