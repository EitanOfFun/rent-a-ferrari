/*global $, alert */
$(document).ready(function () {
  'use strict';

  function logoutBtn() {
    localStorage.removeItem('firstName');
    window.location = 'index.html';
  }

  function checkoutBtn() {
    var totalPrice = document.getElementById('total-price').innerHTML;
    alert('Your Credit Card will be charged ' + totalPrice +
      '\nYour Ferrari is on it\'s way!');
    logoutBtn();
  }

  var firstName = localStorage.getItem('firstName');
  document.getElementById('loggedin-logo').innerHTML = firstName;

  //add Event Listeners
  document.getElementById('logout-btn').addEventListener('click', logoutBtn);
  document.getElementById('checkout-btn').addEventListener('click', checkoutBtn);

});