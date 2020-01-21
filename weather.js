init();

//history list 


var lists = [];

init();

function renderlists() {

  


  for (var i = 0; i < 10; i++) {
    var list = lists[i];

    var $li = $("<li>");
    $li.text(list);
    $li.attr("data-index", i);
    $("#historyList").append(li);
  }
}

function init() {

  var storedLists = JSON.parse(localStorage.getItem("lists"));

  if (storedLists !== null) {
    lists = storedLists;
  }

  
  renderlists();
}

function storelists() {
  
  localStorage.setItem("lists", JSON.stringify(lists));
}

$( "#clear-search" ).click(function() {
  $("#historyList").empty();
});


$("#run-search").on("click", function (event) {
    event.preventDefault();
    var apiKey = "969b3294dab1170e5514e2ab39bbd849";
    var city = $("#search-term")
        .val()
        .trim();

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;


    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(updateCityPage);

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(updateForecastPage);


  //storing search list
  

  if (city === "") {
    return;
  }

  
  lists.push(city);
  city.value = "";

  
  storelists();
  renderlists();


});



function updateCityPage(Data) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

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

        console.log(r)
    });

  
    var iconcode =  Data.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    
    var $cardIcon = $("<img>");
    $cardIcon.attr("src", iconurl);

 
    $("#cardTitle").append($cardIcon);
    $("#city").text(Data.name + "( " + today + " )");
    $("#temp").text("Temperature: " + Data.main.temp + "°");
    $("#humidity").text("Humidity: " + Data.main.humidity);
    $("#wind").text("Wind Speed: " + Data.wind.speed);

    console.log(Data)
    console.log(Data.weather[0].icon)
    console.log($cardIcon)

};



// function updateForecastPage(ForcaseData){
    
//     console.log(ForcaseData);
//     for (let i = 0; i < 5; i+8) {
//         var weather = ForcaseData.list[i];

//         var iconcode =  weather.weather[0].icon;
//         var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    
//         var $cardIcon = $("<img>");
//         $cardIcon.attr("src", iconurl);


        
//         var date = weather.dt_txt.substr(0, 10);
//         var Temp = weather.main.temp;

       
//         var $cardHumidity = $("<p>")
//         $cardHumidity.addClass("card-text");
//         $cardHumidity.text(weather.main.humidity);
      

//         $("#forecast").append(

//             "<div class='card-header'>" + date +  "</div><br>" + 
//             "<div class='card-body'><p class='card-text'>Temp:" + Temp

//         );
 
//     }

// }



