let user_weather_tab = document.querySelector(".User_weather_tab");
let user_req_weather_tab = document.querySelector(".User_request_weather_tab");


let grant_loc_page = document.querySelector(".grant_access_loc");
let user_Location_page = document.querySelector(".user_Location_content");
let user_search_page = document.querySelector(".user_search_location");
let error_page = document.querySelector(".display_Error");
let loading = document.querySelector(".loading_gif");

//assuming first it shows user_weather_tab
let current_tab = user_weather_tab;
current_tab.classList.add("current_tab_indicator");


const API_KEY = "7dec96054a5d5a709218112552ffa332";


// if user clicked on user_weather_tab
user_weather_tab.addEventListener("click", () => {
    user_want_tab(user_weather_tab);
});

// if user clicked on user_search tab
user_req_weather_tab.addEventListener("click", () => {
    user_want_tab(user_req_weather_tab);
});

function user_want_tab(clicked_tab) {
    error_page.classList.remove("active");

    // when unhighlighted tab got clicked
    if (current_tab !== clicked_tab) {
        current_tab.classList.remove("current_tab_indicator");
        current_tab = clicked_tab;
        current_tab.classList.add("current_tab_indicator");

        // above we have recently changed the tab and to know the tab

        // if we search page is not active it means previously we are
        // at user location page and from above we can say we have changed that

        if (!user_search_page.classList.contains("active")) {
            user_Location_page.classList.remove("active");
            grant_loc_page.classList.remove("active");
            user_search_page.classList.add("active");
        }

        // if we user loc page is not active it means previously we are
        // at search page and from above we can say we have changed that

        else {
            user_search_page.classList.remove("active");
            user_Location_page.classList.remove("active");
            getFromStorage();
        }
    }

}

//----------user weather---------------

function getFromStorage() {
    //getting the values of coordinates from user_coordiantes varaible
    // if not present it return undefined else gives values 
    const all_coordinates = sessionStorage.getItem("user_coordinates");

    // donot have user location (undefined case)
    if (!all_coordinates) {
        grant_loc_page.classList.add("active");
    }
    // have location(values)
    else {
        // making json objects 
        const coordinates = JSON.parse(all_coordinates);
        //calling api
        fetchUserweather_val(coordinates);
    }
}

// getting the values according to the lat longitude by fetch data
async function fetchUserweather_val(coordinates) {
    const { lat, lon } = coordinates;
    grant_loc_page.classList.remove("active");
    loading.classList.add("active");

    // call api 
    try {
        const result = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        )
        const data = await result.json();
        loading.classList.remove("active");

            //  error handling
        if ((data?.message) == "city not found") {

            error_page.classList.add("active");
        }
        else {
            // showing the values on ui
            user_Location_page.classList.add("active");
            error_page.classList.remove("active");
            render_user_weather(data);
        }

    }
    catch (err) {
        loading.classList.remove("active");
    }

}



let location_name = document.querySelector(".user_location_name");
let flag = document.querySelector(".location_nation");
let weather_in_oneline = document.querySelector(".weather_description");
let weather_inoneline_img = document.querySelector(".weather_description_img");
let temperature = document.querySelector(".temperature");
let windspeed_value = document.querySelector(".windspeed_val");
let humidity_value = document.querySelector(".humidity_val");
let clouds_percentage = document.querySelector(".clouds_val");

function render_user_weather(data) {

    location_name.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    weather_in_oneline.innerText = data?.weather?.[0]?.main;
    weather_inoneline_img.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${data?.main?.temp.toFixed(2)} °C`;
    windspeed_value.innerText = `${data?.wind?.speed.toFixed(2)}m/s`;
    humidity_value.innerText = `${data?.main?.humidity}%`;
    clouds_percentage.innerText = `${data?.clouds?.all}%`;
    bg_img(weather_in_oneline.innerText);

}
getFromStorage();
const grant_access_btn = document.querySelector(".grant_access_btn");
grant_access_btn.addEventListener("click", getlocation)


function getlocation() {

    //when user click on get access to their location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else {
        alert("Grant Access to show your weather");
    }
}

function showposition(positions) {
    const coordinates = {
        lat: positions.coords.latitude,
        lon: positions.coords.longitude,
    }
    sessionStorage.setItem("user_coordinates", JSON.stringify(coordinates));
    fetchUserweather_val(coordinates);
}


//  ---------search bar------------


let city_name = document.querySelector("#city_name");
let submit_btn = document.querySelector(".city_submit");
submit_btn.addEventListener("click", (e) => {
    e.preventDefault();
    // taking the value of user inputed
    let city = city_name.value;

    if (city === "") {
        return;
    }
    else {
        fetchSearchWeatherval(city);
        city = "";
    }

});

city_name.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        // taking the value of user inputed
        let city = city_name.value;

        if (city === "") {
            return;
        }
        else {
            fetchSearchWeatherval(city);
            city = "";
        }
    }
});

// here we handle with city name rather than latitudes and longitudes so we have handele different

async function fetchSearchWeatherval(city) {
    loading.classList.add("active");
    user_Location_page.classList.remove("active");
    grant_loc_page.classList.remove("active");
    error_page.classList.remove("active");

    try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        // await important otherwise it will either execute or not execute in one go
        const data = await result.json();
        loading.classList.remove("active");

        //Error handling
        if ((data?.message) == "city not found") {

            error_page.classList.add("active");
        }
        else {

            user_Location_page.classList.add("active");
            render_user_weather(data);
        }
    }
    catch (err) {
        loading.classList.remove("active");

    }
}
let background_img = document.querySelector(".background");
function bg_img(weather) {
    if (weather == "Rain" || weather == "Drizzle") {
        background_img.setAttribute("src", "Assets_1/rain.gif");
        document.body.appendParent(background_img);

    }
    else if (weather == "Clear") {
        background_img.setAttribute("src", "Assets_1/sunny.gif");
        document.body.appendParent(background_img);
    }
    else if (weather == "Thunderstorm") {
        background_img.setAttribute("src", "Assets_1/thunderstorms.gif");
        document.body.appendParent(background_img);
    }
    else if (weather == "Clouds") {
        background_img.setAttribute("src", "Assets_1/windy.gif");
        document.body.appendParent(background_img);
    }
    else {
        background_img.setAttribute("src", "Assets_1/classic.gif");
        document.body.appendParent(background_img);
    }
}
