const apiKey = "066175ef18c1de669d745d524ec3467a";
let lat = "44.506159";
let long = "-73.27059";
let city = "Burlington"
let place = "Vermont";
let timeOffset = "";


let weather = {

    fetchWeather: function(lat, long, city) {

        fetch(
            // "https://api.openweathermap.org/data/2.5/weather?q=" + zip + "&units=imperial&appid=" + this.apiKey
            "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey
        )

        .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data))

        //getForecast(this.apiKey, zip);

    },
    displayWeather: function(data) {
        console.log(data);
        const timeZone = data.timezone;

        let localTime = new Date().toLocaleString("en-US", {
            timeZone: timeZone
        })

        let justTime = localTime.split(",")[1].trim();
        let hourMin = justTime.split(":")[0] + ":" + justTime.split(":")[1] + " " + justTime.split(" ")[1];
        //console.log(hourMin);



        document.getElementById("topName").innerText = city + " " + hourMin + " Weather";

        //TODAY
        const { icon, description } = data.current.weather[0];
        const { temp, humidity, feels_like, wind_deg } = data.current; //wind_speed
        const windSpeed = data.current.wind_speed;
        const gusts = data.daily[0].wind_gust;
        let tDesc = data.current.weather[0].main;
        const tHigh = data.daily[0].temp.max;
        const tLow = data.daily[0].temp.min;
        const tempC = (temp - 32) / 1.8;
        const weatherAlerts = data.alerts;
        const windDirection = findDirection(wind_deg);
        let tSnow = "";
        let tRain = "";
        alertContents = "";
        timeOffset = data.timezone_offset;

        if (data.daily[0].snow) {
            tSnow = convertMMtoInches(data.daily[0].snow);
        };

        if (data.daily[0].rain) {
            tRain = convertMMtoInches(data.daily[0].rain);

        };

        //console.log("Curr temp: ", temp);
        //document.querySelector(".city").innerText = "Current Weather: "; // + hourMin;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";


        document.querySelector(".description").innerText = tDesc;


        document.querySelector(".temp").innerText = Math.round(temp) + "°F";
        document.querySelector(".tempC").innerText = "(" + Math.round(tempC) + "°C)";
        document.querySelector(".windchill").innerText = "Feels like: " + Math.round(feels_like) + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind: " + windDirection + " " + Math.round(windSpeed) + " mph";
        document.querySelector(".gust").innerText = "Gusts: " + Math.round(gusts) + " mph";

        document.querySelector(".todayDesc").innerText = "High: " + Math.round(tHigh) + "°F,  Low: " + Math.round(tLow) + "°F";
        //document.querySelector(".tIcon").src = "https://openweathermap.org/img/wn/" + tIcon + ".png";
        document.querySelector(".precip").innerText = "";
        document.querySelector(".precip").innerText = getPrecip(tSnow, tRain);
        //console.log("double: ", getPrecip(tSnow, tRain));

        //if (temp < 20) {
        //    document.querySelector(".scooter").src = "./support/noscooter.png";
        //};

        document.querySelector(".temp").style.color = "white";
        document.querySelector(".tempC").style.color = "white";
        document.querySelector(".windchill").style.color = "white";
        document.querySelector(".wind").style.color = "white";

        if (temp < 11 || temp > 85) {
            //console.log("This is the temp: ", temp)
            document.querySelector(".temp").style.color = "red";
            document.querySelector(".tempC").style.color = "red";
            document.querySelector(".windchill").style.color = "red";
        }
        //console.log("Day precip: ", "Snow: ", data.daily[0].snow, "Rain: ", data.daily[0].rain);
        if (convertMMtoInches(data.daily[0].snow) !== 'undefined' && convertMMtoInches(data.daily[0].snow) > 2) {
            document.querySelector(".precip").style.color = "red";
        }

        if (convertMMtoInches(data.daily[0].rain) !== 'undefined' && convertMMtoInches(data.daily[0].rain) > 1) {
            document.querySelector(".precip").style.color = "red";
        }




        let wAlerts = document.querySelector(".walerts");
        wAlerts.style.display = "none";


        if (weatherAlerts) {
            console.log("walerts called");
            document.querySelector(".modal-body").innerText = "";

            for (let i = 0; i < weatherAlerts.length; i++) {
                // Create an "li" node:
                const node = document.createElement("li");
                const pNode = document.createElement("p");

                // Create a text node:
                const textnode = document.createTextNode(weatherAlerts[i].description);

                // Append the text node to the "li" node:
                node.appendChild(textnode);

                // Append the "li" node to the list:
                document.querySelector(".modal-body").appendChild(node);
                document.querySelector(".modal-body").appendChild(pNode);

                //let alertContent = weatherAlerts[i].description;
                //alertContents += alertContent;
            };
            wAlerts.style.display = "block";
        }
        //console.log("wind: ", windSpeed);
        if (windSpeed > 19) {
            document.querySelector(".wind").style.color = "red";

        };

        if (gusts > 19) {
            document.querySelector(".gust").style.color = "red";
        };

        //Tomorrow

        const tomTemp = data.daily[1].temp.day;
        const tomHum = data.daily[1].humidity;
        const tomChill = data.daily[1].feels_like.day;
        //const tomAlerts = data.daily[1].alerts;
        const tomWindSpeed = data.daily[1].wind_speed;
        const tomGusts = data.daily[1].wind_gust;
        const tomDirection = data.daily[1].wind_deg;
        const tomDesc = data.daily[1].weather[0].main;
        const tomHigh = Math.round(data.daily[1].temp.max);
        const tomLow = Math.round(data.daily[1].temp.min);
        const tomIcon = data.daily[1].weather[0].icon;
        const tomTempC = (tomTemp - 32) / 1.8;
        let tomSnow;
        let tomRain;
        let tomPrecip;

        //Holder for scooter image

        if (data.daily[1].snow) { tomSnow = convertMMtoInches(data.daily[1].snow) };
        if (data.daily[1].rain) { tomRain = convertMMtoInches(data.daily[1].rain) };

        //console.log("tomPrecip: ", convertMMtoInches(data.daily[1].snow), convertMMtoInches(tomSnow, tomRain));

        document.querySelector(".tomIcon").src =
            "https://openweathermap.org/img/wn/" + tomIcon + ".png";
        document.querySelector(".tomDesc").innerText = tomDesc;
        document.querySelector(".tomTemp").innerText = Math.round(tomTemp) + "°F";
        document.querySelector(".tomTempC").innerText = "(" + Math.round(tomTempC) + "°C)";
        document.querySelector(".tomChill").innerText = "Feels like: " + Math.round(tomChill) + "°F";
        document.querySelector(".tomHum").innerText = "Humidity: " + tomHum + "%";
        document.querySelector(".tomHiLo").innerText = "High: " + tomHigh + "°F, Low: " + tomLow + "°F";
        document.querySelector(".tomWind").innerText =
            "Wind: " + findDirection(tomDirection) + " " + Math.round(tomWindSpeed) + " mph";
        document.querySelector(".tomGust").innerText = "Gusts: " + Math.round(tomGusts) + " mph";
        document.querySelector(".tomPrecip").innerText = getPrecip(tomSnow, tomRain);



        if (tomSnow > 3 || tomRain > 1) {
            document.querySelector(".tomPrecip").style.color = "red";
        }
        if (Math.round(tomWindSpeed) > 19) {
            document.querySelector(".tomWind").style.color = "red";
        };
        if (Math.round(tomGusts) > 19) {
            document.querySelector(".tomGust").style.color = "red";
        };

        if (tomTemp < 11 || tomTemp > 85) {
            //console.log("This is the temp: ", temp)
            document.querySelector(".tomTemp").style.color = "red";
            document.querySelector(".tomTempC").style.color = "red";
        };


        document.querySelector(".weather").classList.remove("loading");
        //console.log(city);

        document.body.style.backgroundImage =
            "url('https://source.unsplash.com/1920x1080/?" + place + "')";

        dayForecast(data);
    }


};


function checkLocation() {
    let isChecked = document.querySelector(".switch-input").checked;


    if (isChecked) {
        lat = "51.799";
        long = "1.545";
        city = "Minster Lovell";
        place = "Cotswolds"
        weather.fetchWeather(lat, long, city);

    } else {
        lat = "44.506159";
        long = "-73.27059";
        city = "Burlington";
        place = "Vermont"
        weather.fetchWeather(lat, long, city);
    };

    document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1920x1080/?" + place + "')";

    //console.log("Clicked", lat, long, city);

};

document.querySelector(".switch-input").addEventListener("click", checkLocation);

//console.log(document.querySelector(".switch-input").checked);

//weather.fetchWeather(lat, long, city);




checkLocation();