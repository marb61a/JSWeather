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

})();