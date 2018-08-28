/*
  UI Elements Module
*/
const UI = (function(){
  let menu = document.querySelector("#menu-container");

  // Hide loading screen & show app
  const showApp = () => {
    document.querySelector("#app-loader").classList.add('display-none');
    document.querySelector("main").removeAttribute('hidden');
  }

  // Hide app & show loading screen
  const loadApp = () => {
    document.querySelector("#app-loader").classList.remove('display-none');
    document.querySelector("main").setAttribute('hidden', 'true');
  }

  // Show menu
  const _showMenu = () => menu.style.right = 0;

  // Hide menu
  const _hideMenu = () => menu.style.right = '-65%';

  const _toggleHourlyWeather = () => {
    let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
        arrow = document.querySelector("#toggle-hourly-weather").children[0],
        visible = hourlyWeather.getAttribute('visible'),
        dailyWeather = document.querySelector('#daily-weather-wrapper');
    
    if(visible == 'false'){
      hourlyWeather.setAttribute('visible', true);
      hourlyWeather.style.bottom = 0;
      arrow.style.transform = 'rotate(180deg)';
      dailyWeather.style.opacity = 0;
    } else if(visible == 'true'){
      hourlyWeather.setAttribute('visible', false);
      hourlyWeather.style.bottom = '-100%';
      arrow.style.transform = 'rotate(0deg)';
      dailyWeather.style.opacity = 1;
    } else {
      console.error("Unknown state of the hourly weather panel and visible attribute");
    }
  };

  const drawWeatherData = (data, location) => {
    let currentlyData = data.currently,
        dailyData = data.daily.data,
        hourlyData = data.hourly.data,
        weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dailyWeatherWrapper = document.querySelector('#daily-weather-wrapper'),
        dailyWeatherModel,
        day,
        maxMinTemp,
        dailyIcon,
        hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
        hourlyWeatherModel,
        hourlyIcon;
    
    // Set Current weather 
    document.querySelectorAll('.location-label')
      .forEach((e) => {
        e.innerHTML = location
      });
    
    document.querySelector('main').style.backgroundImage = 
      `url("./assets/images/bg-images/${currentlyData.icon}.jpg")`;
    
    document.querySelector("#currentlyIcon")
      .setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
    
    document.querySelector("#summary-label").innerHTML = currentlyData.summary;

    // Set temperature from Fahrenheit -> Celcius
    document.querySelector("#degrees-label").innerHTML =
      Math.round((currentlyData.temperature - 32) * 5 / 9)  + '&#176;'
    
    // Set humidity
    document.querySelector("#humidity-label").innerHTML = 
      Math.round(currentlyData.humidity * 100) + '%';
    
    // Set the wind speed
    document.querySelector("#wind-speed-label").innerHTML =
      (currentlyData.windSpeed * 1.6093).toFixed(1) + ' kph';
    
    /*
      Set the daily weather
    */
    while(dailyWeatherWrapper.children[1]){
      dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
    }

    for (let i = 0; i <= 6; i++){
      // Clones the node and removes the display none close
      dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
      dailyWeatherModel.classList.remove('display-none');

      day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
      dailyWeatherModel.children[0].children[0].innerHTML = day;

      // Set min max temperature in Celcius
      maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) 
        + '&#176;' + '/' 
        + Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
      dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

      // Set the daily icon
      dailyIcon = dailyData[i].icon;
      dailyWeatherModel.children[1].children[0]
        .setAttribute('src', `./assets/images/summary-icons/${dailyIcon}-white.png`);
      
      // Append the model
      dailyWeatherWrapper.appendChild(dailyWeatherModel);
    }
    dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

    /*
      Set the hourly weather
    */
    while(hourlyWeatherWrapper.children[1]){
      hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
    }

    for(let i = 0; i <= 24; i++){
      hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
      hourlyWeatherModel.classList.remove('display-none');
      
      // Set the hour
      hourlyWeatherModel.children[0].children[0].innerHTML =
        new Date(hourlyData[i].time * 1000).getHours() + ":00";
      
      hourlyWeatherModel.children[1].children[0].innerHTML =
        Math.round((hourlyData[i].temperature - 32) * 5 / 9) + '&#176;';
      
      hourlyIcon = hourlyData[i].icon;  

      hourlyWeatherModel.children[1].children[1].children[0]
        .setAttribute('src', `./assets/images/summary-icons/${hourlyIcon}-grey.png`);

      hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
    };

    UI.showApp();

  };

  // Menu events
  document.querySelector('#open-menu-btn').addEventListener('click', _showMenu);
  document.querySelector('#close-menu-btn').addEventListener('click', _hideMenu);

  // Hourly weather wrapper event
  document.querySelector("#toggle-hourly-weather")
    .addEventListener('click', _toggleHourlyWeather);

  return {
    showApp,
    loadApp,
    drawWeatherData
  };
})();


/*
  LocalStorage API Module
*/
const LOCALSTORAGE = (function(){
  let savedCities = [];

  const save = (city) => {
    savedCities.push(city);
    localStorage.setItem('savedCities', JSON.stringify('savedCities'));
  };

  const get = () => {
    if(localStorage.getItem('savedCities') != null){
      savedCities = JSON.parse(localStorage.getItem('savedCities'));
    }
  };

  const remove = (index) => {
    if(index < savedCities.length){
      savedCities.splice(index, 1);
      localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
  };

  const getSavedCities = () => savedCities;

  return {
    save,
    get,
    remove,
    getSavedCities
  };
})();


/*
  Saved Cities Module
*/
const SAVEDCITIES = (function(){
  let container = document.querySelector("#saved-cities-wrapper");

  // Draw a saved city inside the menu
  const drawCity = (city) => {
    let cityBox = document.createElement('div'),
        cityWrapper = document.createElement('div'),
        deleteWrapper = document.createElement('div'),
        cityTextNode = document.createElement('h1'),
        deleteBtn = document.createElement('button');
    
    cityBox.classList.add('saved-city-box', 'flex-container');
    cityTextNode.innerHTML = city;
    cityTextNode.classList.add('set-city');
    cityWrapper.classList.add('ripple', 'set-city');
    cityWrapper.append(cityTextNode);
    cityBox.append(cityWrapper);

    deleteBtn.classList.add('ripple', 'remove-saved-city');
    deleteBtn.innerHTML = '-';
    deleteWrapper.append(deleteBtn);
    cityBox.append(deleteWrapper);

    container.append(cityBox);
  }

  // Delete a city
  const _deleteCity = (cityHTMLbtn) => {
    // Create an array from the saved cities
    let nodes = Array.prototype.slice.call(container.children),
        // Go up DOM tree until finding city wrapper
        cityWrapper = cityHTMLBtn.closest('.saved-city-box'),
        cityIndex = nodes.indexOf(cityWrapper);

    LOCALSTORAGE.remove(cityIndex);
    cityWrapper.remove();
  }

  document.addEventListener('click', function(){
    if(event.target.classList.contains('remove-saved-city')){
      _deleteCity(event.target);
    }
  });

  document.addEventListener('click', function(event){
    if(event.target.classList.contains('set-city')){
      let nodes = Array.prototype.slice.call(container.children),
          cityWrapper = event.target.closest('.saved-city-box'),
          cityIndex = nodes.indexOf(cityWrapper),
          savedCities = LOCALSTORAGE.getSavedCities();
      
      WEATHER.getWeather(savedCities[cityIndex], false);
    }
  });

  return {
    drawCity
  };
})();


/*
  Get Location Module
*/
const GETLOCATION = (function(){
  let location;

  const locationInput = document.querySelector('#location-input'),
        addCityBtn = document.querySelector('#add-city-btn');
  
  const _addCity = () => {
    location = locationInput.value;
    locationInput.value = '';
    addCityBtn.setAttribute('disabled', 'true');
    addCityBtn.classList.add('disabled');

    console.log('Get weather for', location);
  }

  locationInput.addEventListener('input', function(){
    let inputText = this.value.trim();

    if(inputText != ''){
      addCityBtn.removeAttribute('disabled');
      addCityBtn.classList.remove('disabled');
    } else {
      addCityBtn.setAttribute('disabled', 'true');
      addCityBtn.classList.add('disabled');
    }

    addCityBtn.addEventListener('click', _addCity);
  })
})();

/*
  Get Weather Data Module
*/
const WEATHER = (function(){
  const darkSkyKey = '',
        geoCoderKey = '';
  
  const _getGeocodeURL = (location) => 
    `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

  const _getDarkSkyURL = (lat, lng) => 
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`; 

    const _getDarkSkyData = (url, location) => {
      axios.get(url)
        .then((res) => {
          console.log(res);
          UI.drawWeatherData(res.data, location)
        })
        .catch((err) => {
          console.log(err);
        })
    };

    const getWeather = (location) => {
      UI.loadApp();

      // Get formatted url from OpenCageData 
      let geocodeURL = _getGeocodeURL(data);

      // Get the data from OpenCageData 
      axios.get(geocodeURL)
        .then((res) => {
          // If invalid location
          if(res.data.results.length == 0){
            console.error("Invalid Location");
            UI.showApp();
            return;
          }

          if(save){
            LOCALSTORAGE.save(location);
            SAVEDCITIES.drawCity(location);
          }
          
          let lat = res.data.results[0].geometry.lat,
              lng = res.data.results[0].geometry.lng;
          
          // Get formatted URL from darkSky
          let darkskyURL = _getDarkSkyURL(lat, lng);

          // Get the weather data
          _getDarkSkyData(darkskyURL, location);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return {
      getWeather
    };
})();

/*
  Init Module
*/
window.onload = function () {
  // Get the items from localStorage & store inside the savedCities array
  LOCALSTORAGE.get();

  let cities = LOCALSTORAGE.getSavedCities();

  // Check localStorage for any elements
  if(cities.length != 0 ){
    // Draw each saved city inside the menu
    cities.forEach((city) => SAVEDCITIES.drawCity(city));

    WEATHER.getWeather(cities[cities.length - 1], false);
  } else {
    UI.showApp();
  }
};