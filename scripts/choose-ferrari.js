/*global alert */
function logoutBtn() {
  'use strict';
  localStorage.removeItem('firstName');
  window.location = 'index.html';
}
function checkoutBtn() {
  'use strict';
  var totalPrice = document.getElementById('total-price').innerHTML;
  alert('Your Credit Card will be charged ' + totalPrice +
        '\nYour Ferrari is on it\'s way!');
  logoutBtn();
}

(function () {
  'use strict';
  //set logo to user's first name
  var firstName = localStorage.getItem('firstName');
  document.getElementById('loggedin-logo').innerHTML = firstName;
  
  //add Event Listeners
  document.getElementById('logout-btn').addEventListener('click', logoutBtn);
  document.getElementById('checkout-btn').addEventListener('click', checkoutBtn);
}());
