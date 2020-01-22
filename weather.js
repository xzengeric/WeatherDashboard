$(document).ready(function () {

  //get today's date

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  //history list 


  var lists = [];
  var storedWeatherDate = [];

  init();

  function renderlists() {

    $("#historyList").empty();
    $("search-result").empty();

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

    $("#weatherIcon").attr("src", storedWeatherDate[0].iconurl);
    $("#city").text(storedWeatherDate[1].city + "( " + today + " )");
    $("#temp").text("Temperature: " + storedWeatherDate[2].temp + "°");
    $("#humidity").text("Humidity: " + storedWeatherDate[3].humidity + "%");
    $("#wind").text("Wind Speed: " + storedWeatherDate[4].wind + " MPH");
    $("#uvIndex").text(storedWeatherDate[5].uvIndex);

  };

  function init() {

    var storedLists = JSON.parse(localStorage.getItem("lists"));
    var storedListsWeather = JSON.parse(localStorage.getItem("storedWeatherDate"));

    if (storedLists !== null) {
      lists = storedLists;


    }

    if (storedListsWeather !== null) {

      storedWeatherDate = storedListsWeather;

    }

    renderlists();
  };

  function storelists() {

    localStorage.setItem("lists", JSON.stringify(lists));
    localStorage.setItem("storedWeatherDate", JSON.stringify(storedWeatherDate));


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

    var apiKey = "969b3294dab1170e5514e2ab39bbd849";
    var city = $("#search-term")
      .val()
      .trim();

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;
    console.log("this is 5day forecastURL", forecastURL)



    //storing search list


    if (city === "") {
      return;
    }


    lists.push(city);
    city.value = "";


    $.ajax({
      url: weatherURL,
      method: "GET"
    }).then(updateCityPage);

    $.ajax({
      url: forecastURL,
      method: "GET"
    }).then(updateForecastPage);

    renderlists();
  });

  function updateCityPage(Data) {

    storedWeatherDate = [];

    var apiKey = "969b3294dab1170e5514e2ab39bbd849";
    var city = $("#search-term")
      .val()
      .trim();
    var lat = Data.coord.lat;
    var lon = Data.coord.lon;

    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?q=" + city + "&appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;



    $.ajax({
      url: uvURL,
      method: "GET"
    }).then(function (r) {

      $("#uvIndex").text(r.value);
      storedWeatherDate.push({ "uvIndex": r.value });
      storelists();
    });


    var iconcode = Data.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";



    $("#weatherIcon").attr("src", iconurl);
    $("#city").text(Data.name + "( " + today + " )");
    $("#temp").text("Temperature: " + Data.main.temp + "°");
    $("#humidity").text("Humidity: " + Data.main.humidity + "%");
    $("#wind").text("Wind Speed: " + Data.wind.speed + " MPH");

    storedWeatherDate.push({ "iconurl": iconurl });
    storedWeatherDate.push({ "city": Data.name });
    storedWeatherDate.push({ "temp": Data.main.temp });
    storedWeatherDate.push({ "humidity": Data.main.humidity });
    storedWeatherDate.push({ "wind": Data.wind.speed });

  };





  function updateForecastPage(ForcaseData) {

    console.log("you are reached update forecast page", ForcaseData);


    for (let i = 0; i < 40; i++) {

      if (i % 8 === 0) {


        var weather = ForcaseData.list[i];

        

        var iconcode = weather.weather[0].icon;
 
        console.log(iconcode);

        var iconUrl = "https://openweathermap.org/img/w/" + iconcode + ".png";

        console.log("This is the URL link: ",iconUrl);


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

            
            console.log(date, temp, humidity);
            $("#forecast").append(

              "<div class='card-body' style='width: 20% ;float:left;'>" + 
              "<h6 class='card-subtitle mb-2 text-muted'> " + date + "</h6>" +
              "<img src='"+iconUrl +"'></img>"+
              "<h6 class='card-subtitle mb-2 text-muted'>" + temp + "</h6>" +
              "<h6 class='card-subtitle mb-2 text-muted'>" + humidity + "</h6>" +
              "</div>"


         );

      }
    }

  }

 




});