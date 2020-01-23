$(document).ready(function () {
  //set one default 
navigator.geolocation.getCurrentPosition(position => {
  console.log(position.coords.latitude)
  console.log(position.coords.longitude)
})

  //get today's date

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  // arrays
  var lists = [];
  var storedWeatherData = [];
  var city = "";
  var weatherURL = "";
  var forecastURL = "";
  var uvURL = "";
  var iconurl = "";
  var apiKey = "969b3294dab1170e5514e2ab39bbd849";
  var lat = "";
  var lon = "";
  init();

  function init() {

    //get default data

    var storedLists = JSON.parse(localStorage.getItem("lists"));
    var storedListsWeather = JSON.parse(localStorage.getItem("storedWeatherData"));

 
    if (storedLists !== null) {
      lists = storedLists;
      city = lists[lists.length-1];
    } else {
      city= "redmond";
    }
    
    
    
    if (storedListsWeather !== null) {
      storedWeatherData = storedListsWeather;
      city = storedWeatherData[1].city ;
    } else {
      city= "redmond";
    }

   
    console.log(city)
    
    

    buildURL();

    renderlists();
  };


  function buildURL() {
    console.log("confirm city")
    console.log(city)
    weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;


    $.ajax({
      url: weatherURL,
      method: "GET"
    }).then(updateCityPage);

    $.ajax({
      url: forecastURL,
      method: "GET"
    }).then(updateForecastPage);



  }





  function renderlists() {

    $("#historyList").empty();

    storedLists = JSON.parse(localStorage.getItem("lists"));
    storedListsWeather = JSON.parse(localStorage.getItem("storedWeatherData"));

    //history list
    for (var i = 0; i < 10; i++) {

      var list = lists[i];
      var $li = $("<button>");
      $li.text(list);
      $li.addClass("btn btn-block ");
      $li.attr("id", "history-term");
      $li.attr("style", "color:black");
      $li.attr("style", "blackground-color:e9ecef");
      $li.attr("data-index", i);
      $("#historyList").append($li);
    }

    //fillup one day weather 

    $("#weatherIcon").attr("src", storedWeatherData[0].iconurl);
    $("#city").text(storedWeatherData[1].city + "( " + today + " )");
    $("#temp").text("Temperature: " + storedWeatherData[2].temp + "°");
    $("#humidity").text("Humidity: " + storedWeatherData[3].humidity + "%");
    $("#wind").text("Wind Speed: " + storedWeatherData[4].wind + " MPH");
    $("#uvIndex").text(storedWeatherData[5].uvIndex);

    console.log("Displayed everything fine")
    storedWeatherData = [];
    console.log("empty array of storedWeatherData", storedWeatherData)

  };


  function storelists() {

    localStorage.setItem("lists", JSON.stringify(lists));
    localStorage.setItem("storedWeatherData", JSON.stringify(storedWeatherData));


  }


  $("#clear-search").click(function () {

    $("#historyList").empty();
    lists = [];
    localStorage.clear();
    storelists();
    renderlists();
  });


  $("#run-search").on("click", function (event) {
    event.preventDefault();

    city = $("#search-term")
      .val()
      .trim();

    //storing search list

    if (city === "") {
      return;
    }

    lists.push(city);
    city.value = "";
    console.log("after click", city)
    buildURL();
    renderlists();
  });

  function updateCityPage(Data) {

    lat = Data.coord.lat;
    lon = Data.coord.lon;

    uvURL = "https://api.openweathermap.org/data/2.5/uvi?q=" + city + "&appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;


    //get uv Index
    $.ajax({
      url: uvURL,
      method: "GET"
    }).then(function (r) {

      $("#uvIndex").text(r.value);
      storedWeatherData.push({ "uvIndex": r.value });
      storelists();
    });


    var iconcode = Data.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";



    $("#weatherIcon").attr("src", iconurl);
    $("#city").text(Data.name + "( " + today + " )");
    $("#temp").text("Temperature: " + Data.main.temp + "°");
    $("#humidity").text("Humidity: " + Data.main.humidity + "%");
    $("#wind").text("Wind Speed: " + Data.wind.speed + " MPH");

    storedWeatherData.push({ "iconurl": iconurl });
    storedWeatherData.push({ "city": Data.name });
    storedWeatherData.push({ "temp": Data.main.temp });
    storedWeatherData.push({ "humidity": Data.main.humidity });
    storedWeatherData.push({ "wind": Data.wind.speed });

  };





  function updateForecastPage(ForcaseData) {

    console.log("you are reached update forecast page", ForcaseData);

    $("#forecast").empty();


    for (let i = 0; i < 40; i++) {

      if (i % 8 === 0) {


        var weather = ForcaseData.list[i];
        var iconcode = weather.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/w/" + iconcode + ".png";

        var $cardIcon = $("<img>");
        $cardIcon.attr("src", iconUrl);


        var $date = $("<p>");
        var date = weather.dt_txt.substr(0, 10);
        $date.addClass("card-header");
        $date.attr("style", "color:blue;");
        $date.text(date);

        var $temp = $("<p>");
        var temp = "Temperature: " + weather.main.temp + "°";
        $temp.addClass("card-text");
        $temp.attr("style", "color:blue;");
        $temp.text(temp);


        var $cardHumidity = $("<p>")
        var humidity = "Humidity: " + weather.main.humidity + "%";
        $cardHumidity.addClass("card-text");
        $cardHumidity.attr("style", "color:blue;");
        $cardHumidity.text(humidity);

        $("#forecast").append(

          "<div class='card-body' style='width: 20% ;float:left;'>" +
          "<h6 class='card-subtitle mb-2 text-muted'> " + date + "</h6>" +
          "<img src='" + iconUrl + "'></img>" +
          "<h6 class='card-subtitle mb-2 text-muted'>" + temp + "</h6>" +
          "<h6 class='card-subtitle mb-2 text-muted'>" + humidity + "</h6>" +
          "</div>"


        );

      }
    }

  }

});