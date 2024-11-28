const apikey = "9edc49c2dc258c552dd6f23abec1ada8";

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch weather data");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log(data);
                    weatherReport(data);
                })
                .catch((error) => {
                    showError("Unable to retrieve weather data. Please try again later.");
                    console.error(error);
                });
        });
    }
});

function searchByCity() {
    const place = document.getElementById("input").value;
    const urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

    fetch(urlsearch)
        .then((res) => {
            if (!res.ok) {
                throw new Error("City not found");
            }
            return res.json();
        })
        .then((data) => {
            weatherReport(data);
        })
        .catch((error) => {
            showError("City not found. Please enter a valid city or country name.");
            console.error(error);
        });

    document.getElementById("input").value = "";
}

function weatherReport(data) {
    const urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

    fetch(urlcast)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch forecast data");
            }
            return res.json();
        })
        .then((forecast) => {
            console.log(forecast.city);
            hourForecast(forecast);
            dayForecast(forecast);

            document.getElementById("city").innerText = data.name + ", " + data.sys.country;
            document.getElementById("temperature").innerText = Math.floor(data.main.temp - 273) + " °C";
            document.getElementById("clouds").innerText = data.weather[0].description;

            const icon1 = data.weather[0].icon;
            const iconurl = `http://openweathermap.org/img/w/${icon1}.png`;
            document.getElementById("img").src = iconurl;
        })
        .catch((error) => {
            showError("Unable to retrieve forecast data.");
            console.error(error);
        });
}

function hourForecast(forecast) {
    document.querySelector(".templist").innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const date = new Date(forecast.list[i].dt * 1000);

        const hourR = document.createElement("div");
        hourR.setAttribute("class", "next");

        const div = document.createElement("div");
        const time = document.createElement("p");
        time.setAttribute("class", "time");
        time.innerText = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

        const temp = document.createElement("p");
        temp.innerText = Math.floor(forecast.list[i].main.temp_max - 273) + " °C / " +
                         Math.floor(forecast.list[i].main.temp_min - 273) + " °C";

        div.appendChild(time);
        div.appendChild(temp);

        const desc = document.createElement("p");
        desc.setAttribute("class", "desc");
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector(".templist").appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector(".weekF").innerHTML = "";
    for (let i = 8; i < forecast.list.length; i += 8) {
        const div = document.createElement("div");
        div.setAttribute("class", "dayF");

        const day = document.createElement("p");
        day.setAttribute("class", "date");
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString();
        div.appendChild(day);

        const temp = document.createElement("p");
        temp.innerText = Math.floor(forecast.list[i].main.temp_max - 273) + " °C / " +
                         Math.floor(forecast.list[i].main.temp_min - 273) + " °C";
        div.appendChild(temp);

        const description = document.createElement("p");
        description.setAttribute("class", "desc");
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector(".weekF").appendChild(div);
    }
}

function showError(message) {
    const errorDiv = document.getElementById("error");
    errorDiv.innerText = message;
    errorDiv.style.display = "block";

    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 5000);
}
