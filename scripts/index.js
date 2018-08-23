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

  // Menu events
  document.querySelector('#open-menu-btn').addEventListener('click', _showMenu);
  document.querySelector('#close-menu-btn').addEventListener('click', _hideMenu);

  // Hourly weather wrapper event
  document.querySelector("#toggle-hourly-weather")
    .addEventListener('click', _toggleHourlyWeather);

  return {
    showApp,
    loadApp
  }
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
  Get Weather Data
*/
const WEATHER = (function(){

})();

/*
  Init
*/
window.onload = function () {
  UI.showApp();
};