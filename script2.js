function displayHourly(data) {

    const hourly = data.hourly;
    const hourArray = [];
    const timeZone = data.timezone;
    //const { icon, description } = hourly.weather[0];
    let hHour = "";

    //console.log(hourly);
    //console.log(timeZone);

    for (let j = 2; j < 25; j = j + 3) {
        //console.log(j, hourly[j].temp, hourly[j].feels_like, hourly[j].weather[0].main, hourly[j].weather[0].description, hourly[j].weather[0].icon);
        //let longTime = new Date(hourly[j + 1].dt * 1000).toUTCString("en");
        //let firstPart = longTime.split(":")[0];
        //let hourPart = parseInt(firstPart.split(" ")[4]);
        //let hourOffset = timeOffset / 3600;
        let localFull, localTime, hHour;

        localFull = new Date(hourly[j + 1].dt * 1000).toLocaleString("en-US", {
            timeZone: timeZone
        })

        localTime = localFull.split(", ")[1];
        hHour = localTime.split(":")[0] + " " + localTime.split(" ")[1].toLowerCase();

        //console.log("HourPart: ", localFull);


        let hTemp = Math.round(hourly[j].temp) + "°F";
        let hFeels = Math.round(hourly[j].feels_like) + "°F";
        let hDescrip = hourly[j].weather[0].main;
        let hIcon = hourly[j].weather[0].icon;
        let hWind = Math.round(hourly[j].wind_speed);
        let hWindDir = findDirection(hourly[j].wind_deg);
        let hPrecip = 'None';

        let oneHour = "1h";
        if (hourly[j].snow) {
            hPrecip = convertMMtoInches(hourly[j].snow[oneHour]);
        };
        if (hourly[j].rain) {
            hPrecip = convertMMtoInches(hourly[j].rain[oneHour]);
        };

        hourArray.push({
            "Hour": hHour,
            "Icon": hIcon,
            "Cond": hDescrip,
            "Temp ": hTemp,
            "Feels Like ": hFeels,
            "Wind ": hWindDir + " " + hWind,
            "Precip ": hPrecip
        });

    };
    //console.log(hourArray);
    //let hourData = hourArray;
    drawTableAddHeaders(hourArray, ["Time", "", "", "Temp", "Feels Like", "Wind", "Precip"], "hourTable");

    let hourGroup = document.querySelector("#hourTable").children;

    for (let w = 1; w < hourGroup.length; w++) {
        let windGroup = hourGroup[w].children[5];
        let precipGroup = hourGroup[w].children[6];
        let tempGroup = hourGroup[w].children[3];
        let feelsGroup = hourGroup[w].children[4];
        let eachTemp = tempGroup.innerText.split("°F")[0];
        let eachFeels = feelsGroup.innerText.split("°F")[0];
        let eachWind = windGroup.innerText.split(" ")[1];
        let eachPrecip = precipGroup.innerText;

        //console.log(eachTemp, eachFeels, eachWind, eachPrecip);

        if (eachWind > 19) {
            windGroup.style.color = "red";
        }
        if (eachTemp < 10 || eachTemp > 90) {
            tempGroup.style.color = "red"
        }
        if (eachFeels < 11 || eachFeels > 89) {
            feelsGroup.style.color = "red"
        }
        if (eachPrecip !== "None" && eachPrecip.split('"')[0] > 1) {
            precipGroup.style.color = "red";
        }


    }; //.children[1].children[5].innerText);

};

function dayForecast(data) {

    let fday = "";

    const forecastEl = document.getElementsByClassName("forecast");
    const dayEl = document.getElementsByClassName("dayCard");

    //CLEAR OUT PREVIOUS DAY CARDS
    if (forecastEl[0].children.length > 0) {
        while (forecastEl[0].firstChild) {
            forecastEl[0].removeChild(forecastEl[0].firstChild);
        }
    };

    //data.daily.forEach((value, index) => {

    let value = data.daily;
    //console.log(new Date(value[0].dt * 1000).toLocaleDateString("en", {
    //    weekday: "long",
    //}));

    const precipEl = document.getElementsByClassName("dailyPrecip");
    //console.log(value);
    for (let d = 2; d < value.length; d++) {
        if (d > 0) {

            let dayname = new Date(value[d].dt * 1000).toLocaleDateString("en", {
                weekday: "long",
            });
            let warning = "color:white";
            let precipWarning = "color:white";

            let dicon = value[d].weather[0].icon;
            let dic = "https://openweathermap.org/img/wn/" + dicon + ".png"
            let dtempMax = value[d].temp.max.toFixed(0);
            let dtempMin = value[d].temp.min.toFixed(0);
            let dayDesc = value[d].weather[0].main;
            let dayDetail = value[d].weather[0].description;
            let capDayDetail = dayDetail.charAt(0).toUpperCase() + dayDetail.slice(1);
            let dayWind = value[d].wind_speed.toFixed(0);
            let dayDir = value[d].wind_deg;
            let dayWindDirection = findDirection(dayDir);
            let daySnow = 0;
            let dayRain = 0;


            if (value[d].snow) {
                daySnow = convertMMtoInches(value[d].snow);
            };
            if (value[d].rain) {
                dayRain = convertMMtoInches(value[d].rain);
            };

            //Color winds from south
            if (dayWind > 19) { //dayWindDirection.includes("S") && dtempMax < 40
                warning = "color:red"
            };

            if (daySnow > 3.99 || dayRain > 1.99) {
                precipWarning = "color:red";
            };

            //Holder for scooter image

            let dayPrecip = getPrecip(daySnow, dayRain);


            fday = `<div class="forecast-day">
						${dayname}<br />
            <img src=${dic}></img>
						<div class="forecast-day--temp">${dtempMax}<sup>°F</sup>/${dtempMin}<sup>°F</sup></div>
            <p>${capDayDetail}</p> 
            <div class = "dailyPrecip" style = ${precipWarning}> ${dayPrecip}</div>
            <p class= "dayWindData" id = ${d} style = ${warning}>Wind: ${dayWindDirection} ${dayWind} mph</p> 
            `;

            forecastEl[0].insertAdjacentHTML('beforeend', fday);
        };


    };


    displayHourly(data);

};



function findDirection(deg) {
    let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
    let windDirection = compassSector[(deg / 22.5).toFixed(0)];
    return windDirection;
};

function convertMMtoInches(MM) {
    let depth = (MM / 25.4).toFixed(1);
    //console.log(MM, MM / 25.4, depth);
    if (depth < 0.1) {
        depth = "Trace"
    } else {
        depth = depth + '"'
    }
    console.log(depth);
    return depth;
};


function showModal() {
    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    modal.style.display = "block";

    document.querySelector(".modal-body").innerText = alertContents;

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};


function drawTableAddHeaders(obj, headers, target) {


    document.getElementById(target).innerHTML = '';


    let tbody = document.getElementById(target);
    tbody.innerHTML = '';
    tbody.border = "0";
    tbody.padding = "1";
    let columnCount = headers.length;
    let row = tbody.insertRow(-1);
    //set the headers
    for (let i = 0; i < columnCount; i++) {
        let headerCell = document.createElement("TH");
        headerCell.innerHTML = headers[i];
        row.appendChild(headerCell);
    };
    // loop through data source
    for (let i = 0; i < obj.length; i++) {
        let tr = document.createElement("tr");
        for (let colName in obj[i]) {
            let td = document.createElement("td");
            td.innerHTML = obj[i][colName];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    };

    let table = document.getElementById(target);
    for (let w = 1; w < table.rows.length; w++) {
        let ic = `<img class = "hhIcon" src="https://openweathermap.org/img/wn/` + obj[w - 1].Icon + `.png"></img>`;
        table.rows[w].cells[1].innerHTML = ic;
    };
};

function getPrecip(sno, rane) {
    //console.log("Sno rane", sno, rane);
    if (sno && rane) {
        dayPrecip = "Snow: " + sno, "Rain: " + rane;
    };
    if (sno && !rane) {
        dayPrecip = "Snow: " + sno;
    };
    if (rane && !sno) {
        dayPrecip = "Rain: " + rane;
    };
    if (!sno && !rane) {
        dayPrecip = "Precip: None";
    };
    //console.log("dayPrecip function: ", dayPrecip)
    return dayPrecip;
}