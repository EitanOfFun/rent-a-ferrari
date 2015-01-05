// input validation functions
function isFirstNameValid(firstName) {
  'use strict';
  var onlyCharacters = /^[A-Za-z]+$/;
  return onlyCharacters.test(firstName);
}

function isEmailValid(email) {
  'use strict';
  // anystring@anystring.anystring
  var onlyEmails = /\S+@\S+\.\S+/;
  return onlyEmails.test(email);
}

function isPhoneValid(phone) {
  'use strict';
  // 10 digit numbers
  var onlyTenDigitNumbers = /^\d{10}$/;
  return onlyTenDigitNumbers.test(phone);
}

function isPasswordValid(password) {
  'use strict';
  // The password's first character must be a letter, 
  // it must contain at least 4 characters and no more than 15 characters
  // and no characters other than letters, numbers and the underscore may be used
  var onlyValidPasswords = /^[a-zA-Z]\w{3,14}$/;
  return onlyValidPasswords.test(password);
}

function isDobValid(birthday) {
  'use strict';
  // over 16 years old
  return (new Date() - new Date(birthday) >
    (365.25 * 24 * 60 * 60 * 1000) * 16);

}

function isLicenseValid(license) {
  'use strict';
  // 7 digit numbers
  var onlySevenDigitNumbers = /^\d{7}$/;
  return onlySevenDigitNumbers.test(license);
}

//helper functions

function existy(x) {
  // true if argument is neither undefined or null
  return x != null;
}

//input - the input DOM element 
//value - true (valid) false (invalid)
function setInput(input, value) {
  'use strict';
  if (value) {
    input.classList.remove('bad-input');
  } else {
    input.classList.add('bad-input');
  }
}

//input - the input DOM element 
//validator - validator function to apply to input.value
//setInput - apply DOM styling function to input 
function validateInput(input, validator, setInput) {
  'use strict';
  if (validator(input.value)) {
    setInput(input, true);
    return true;
  } else {
    setInput(input, false);
    return false;
  }
}

//onclick functions for buttons 
function loginBtn() {
  'use strict';
  var username = document.getElementById('login-username'),
    password = document.getElementById('login-password'),
    users = JSON.parse(localStorage.getItem('users'));

  if (!existy(users[username.value])) {
    //username doesn't exist
    setInput(username, false);
    setInput(password, true);
  } else if (users[username.value].password !== password.value) {
    //password isn't correct
    setInput(username, true);
    setInput(password, false);
  } else {
    //username exists and password is correct
    setInput(username, true);
    setInput(password, true);
    localStorage.setItem('firstName', users[username.value].firstName);
    window.location = 'choose-ferrari.html';
  }
}

function registerBtn() {
  'use strict';
  var firstName = document.getElementById('register-firstName'),
    username = document.getElementById('register-username'),
    password = document.getElementById('register-password'),
    dob = document.getElementById('register-dob'),
    license = document.getElementById('register-license'),
    users = JSON.parse(localStorage.getItem('users'));

  function isUsernameAvailable(username) {
    return !existy(users[username]);
  }
  if (validateInput(firstName, isFirstNameValid, setInput) &
    (validateInput(username, isUsernameAvailable, setInput) &&
      (validateInput(username, isEmailValid, setInput) ||
        validateInput(username, isPhoneValid, setInput))) &
    validateInput(password, isPasswordValid, setInput) &
    validateInput(dob, isDobValid, setInput) &
    validateInput(license, isLicenseValid, setInput)
  ) {
    //all validations passed!
    var user = {
      "firstName": firstName.value,
      "username": username.value,
      "password": password.value,
      "dob": dob.value,
      "license": license.value
    };

    users[user.username] = user;
    localStorage.setItem('users', JSON.stringify(users));
    //login with new user
    localStorage.setItem('firstName', users[user.username].firstName);
    window.location = 'choose-ferrari.html';
  }
}



//initialize database with 1 admin user
function initializeUsersDatabase() {
  'use strict';
  localStorage.setItem('users', JSON.stringify({
    admin: {
      username: 'admin',
      password: 'admin',
      firstName: 'Admin',
      email: 'admin@admin.com',
      dob: '1990-1-1',
      license: '1234567'
    }
  }));
}
(function () {
  'use strict';
  //if first visit on page initialize database
  if (!existy(localStorage.getItem('users'))) {
    initializeUsersDatabase();
  }
  //add Event Listeners
  document.getElementById('login-btn').addEventListener('click', loginBtn);
  document.getElementById('register-btn').addEventListener('click', registerBtn);

}());

//function inittest(){
//   document.getElementById('register-firstName').value = "bla";
//   document.getElementById('register-username').value = "bla@bla.com";
//   document.getElementById('register-password').value = "blaaa";
//   document.getElementById('register-dob').value = "1990-02-03";
//   document.getElementById('register-license').value = "1234567";
//}
//inittest();
